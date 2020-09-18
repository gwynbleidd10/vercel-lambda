// import Cors from 'cors'
// import initMiddleware from '../../../utils/cors'

// const cors = initMiddleware(
//     Cors({
//         "origin": "*",
//     })
// )
const { cors } = require('../../../utils/cors')

const { fetchPost } = require('../../../utils/fetchPost')

module.exports = async (req, res) => {
    await cors(req, res)
    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: 'WebHook for TG bot',
        })
    }
    else {
        res.json({
            status: 200,
            response: 'OK'
        })
        processing(req.body)
    }
}

//{rc, title, url, type, from, author, status, [comment]}
async function processing(data) {
    //console.log(data)
    let list = [], arr = [], stat = [], authors, user, send, tmp = ''

    const info = (await fetchPost({
        db: "esed",
        model: "Esed_User",
        method: "findOne",
        data: {
            tg: data.from
        }
    }, '/api/database/mongodb')).response
    let status = {
        rc: data.rc,
        from: info.name,
        dept: info.dept,
        org: info.org,
        type: (data.type == 'visa') ? 'Визирование' : (data.type == 'sign') ? 'Подпись' : (data.type == 'visa-send') ? 'Отправка на визирование' : (data.type == 'sign-send') ? 'Отправка на подпись' : (data.type == 'resolution') ? 'Поручение' : (data.type == 'reply') ? 'Отчёт' : 'Иное',
        send: 0,
        input_id: `ObjectId=${(await fetchPost({
            model: "Esed_Input",
            method: "create",
            data
        }, '/api/database/mongodb')).response._id}`,
        send_id: [],
        res_id: []
    }

    let str = `<a href=\"${data.url}\">${data.title}</a>\n================\n<a href="tg://user?id=${data.from}">${info.name}</a> `
    console.log(`[${data.type}][${info.name}]${data.title}`)

    if (data.type == 'visa' || data.type == 'sign') {
        str += ((data.type == 'visa') ? `<i>завизировал(а)` : `<i>подписал(а)`) + `</i>\n================\n<i>${data.status}</i>${(data.comment != undefined) ? `\n================\n<i>Комментарий</i>: ${data.comment}` : ''}`
        authors = (await fetchPost({ id: data.rc, from: info.name }, '/api/esed/prj/exec')).response
        const sendStatus = await getTgFromSqlAndSend(authors, str)
        status.send = sendStatus.send
        status.send_id = sendStatus.send_id
        await insertRc("Out", data.rc)
    }
    else if (data.type == 'visa-send' || data.type == 'sign-send') {
        //     //{title, url, type, from, list}
        str += ((data.type == 'visa-send') ? `отправил(а) на <i>визу` : `отправил(а) на <i>подпись`) + `</i>\n================`
        authors = data.list.split(',')
        const sendStatus = (await getTgAndMsgAndSend(authors, str))
        console.log("end", await sendStatus)
        status.send = sendStatus.send
        status.send_id = sendStatus.send_id
        await insertRc("Out", data.rc)
    }
    else if (data.type == 'resolution') {
        //     //{title, url, type, from, list {title, list, [date]}}
        str += 'назначил(а) <i>поручение</i>\n================'
        const result = await insertResAndSend(data.reslist, status, str)
        status.send = result.send
        status.send_id = result.send_id
        status.res_id = result.res_id
        await insertRc("In", data.rc)
    }
    else {
        //{title, url, type, from, author, status, text}        
        const resolutionAuthor = (await fetchPost({ id: data.reply }, '/api/esed/resolution/author')).response
        const authorInfo = (await fetchPost({
            model: "Esed_User",
            method: "findOne",
            data: {
                name: resolutionAuthor
            }
        }, '/api/database/mongodb')).response
        if (authorInfo) {
            let reg = new RegExp(/.*ознакомлен.*/i)
            //Надоедалка
            let checkText = false
            if (data.text == undefined || reg.test(data.text.substring(0, 10).toLowerCase())) {
                if (authorInfo.super) {
                    str += '<i>ввел(а) пустой отчёт</i>'
                    checkText = true
                }
            }
            else {
                str += `<i>ввел(а) отчет:</i>\n================\nСтатус: <i>${data.status}</i>\n================\n${(data.text) ? data.text : ''}`
                checkText = true
            }
            if (checkText) {
                const authorSend = await sendAndInsert("esed-prod", authorInfo.tg, resolutionAuthor, str)
                status.send += authorSend.send
                status.send_id.push(`ObjectId=${authorSend.id}`)
            }
        }
        await insertRc("In", data.rc)
    }
    console.log(status)
    await fetchPost({
        model: "Request",
        method: "create",
        data: status
    }, '/api/database/mongodb')
    // await insertRc(data.rc, rcInfo)
}

async function insertRc(type, rc) {
    let data = { rc }
    if (type == 'In') {
        const signer = (await fetchPost({
            id: rc
        }, '/api/esed/rc/signer')).response
        console.log('signer', signer)
        data.sign = (signer) ? signer : "Внешний источник"
        data.org = (signer)
            ? (await fetchPost({
                name: signer
            }, '/api/esed/organization')).response
            : (await fetchPost({
                id: rc
            }, '/api/esed/rc/corresp')).response
    }
    else {
        data.author = (await fetchPost({ id: rc }, '/api/esed/prj/author')).response
        data.dept = (await fetchPost({
            name: data.author
        }, '/api/esed/department')).response
        data.org = (await fetchPost({
            name: data.author
        }, '/api/esed/organization')).response
    }
    await fetchPost({
        model: `Esed_Rc_${type}`,
        method: "existsAndCreate",
        filter: {
            rc
        },
        data
    }, '/api/database/mongodb')
}

async function insertResAndSend(res, status, str) {
    let send = 0
    let res_id = []
    let send_id = []
    let text
    for (let i = 0; i < res.length; i++) {
        const resId = (await fetchPost({
            model: "Esed_Res",
            method: "create",
            data: {
                control: res[i].control,
                author: status.from,
                org: status.org,
                dept: status.dept
            }
        }, '/api/database/mongodb')).response._id
        res_id.push(`ObjectId=${resId}`)
        if (res[i].control) {
            text = `${str}\nПоручение: <i>${res[i].title}</i>\n================\nСрок: <i>${res[i].date}</i>\n================`
            const authors = res[i].list.split(',')
            for (let j = 0; j < authors.length; j++) {
                const authorInfo = (await fetchPost({
                    model: "Esed_User",
                    method: "findOne",
                    data: {
                        name: (authors[j][0] == ('(')) ? authors[j].substr(7, authors[j].length - 7) : (authors[j][0] == ('+')) ? authors[j].substr(2, authors[j].length - 2) : authors[j]
                    }
                }, '/api/database/mongodb')).response
                text += (authorInfo) ? `\n<a href="tg://user?id=${authorInfo.tg}">${authors[j]}</a>` : `\n${authors[j]}`
            }
            for (let j = 0; j < authors.length; j++) {
                const authorInfo = (await fetchPost({
                    model: "Esed_User",
                    method: "findOne",
                    data: {
                        name: (authors[j][0] == ('(')) ? authors[j].substr(7, authors[j].length - 7) : (authors[j][0] == ('+')) ? authors[j].substr(2, authors[j].length - 2) : authors[j]
                    }
                }, '/api/database/mongodb')).response
                if (authorInfo) {
                    const sended = await sendAndInsert("esed-prod", authorInfo.tg, (authors[j][0] == ('(')) ? authors[j].substr(7, authors[j].length - 7) : (authors[j][0] == ('+')) ? authors[j].substr(2, authors[j].length - 2) : authors[j], text)
                    send += sended.send
                    send_id.push(`ObjectId=${sended.id}`)
                }
            }
        }
    }
    return {
        send,
        send_id,
        res_id
    }
}

async function getTgAndMsgAndSend(list, str) {
    let send = 0
    let send_id = []
    let text = str
    return Promise.all(
        list.map(async (name) => {
            const authorInfo = (await fetchPost({
                model: "Esed_User",
                method: "findOne",
                data: {
                    name
                }
            }, '/api/database/mongodb')).response
            text += (authorInfo) ? (`\n<a href="tg://user?id=${authorInfo.tg}">${name}</a>`) : ('\n' + name)
        })
    ).then(() => {
        return Promise.all(
            list.map(async (name) => {
                const authorInfo = (await fetchPost({
                    model: "Esed_User",
                    method: "findOne",
                    data: {
                        name
                    }
                }, '/api/database/mongodb')).response
                if (authorInfo) {
                    const sendStatus = await sendAndInsert("esed-prod", authorInfo.tg, name, text)
                    console.log(sendStatus)
                    send += sendStatus.send
                    send_id.push(`ObjectId=${sendStatus.id}`)
                }
            })
        ).then(() => {
            return {
                send,
                send_id,
            }
        })
    })
}

async function getTgFromSqlAndSend(authors, text) {
    let send = 0
    let send_id = []
    return Promise.all(
        authors.map(async (obj) => {
            const authorInfo = (await fetchPost({
                model: "Esed_User",
                method: "findOne",
                data: {
                    name: obj['SURNAME_PATRON']
                }
            }, '/api/database/mongodb')).response
            if (authorInfo) {
                const sendStatus = await sendAndInsert("esed-prod", authorInfo.tg, obj['SURNAME_PATRON'], text)
                send += sendStatus.send
                send_id.push(`ObjectId=${sendStatus.id}`)
            }
        })
    ).then(() => {
        return {
            send,
            send_id
        }
    })
}

async function sendAndInsert(bot, chat_id, user, text) {
    const authorSend = (await fetchPost({
        bot,
        message: {
            parse_mode: "html",
            chat_id,
            text
        }
    }, '/api/tg/sendMessage')).response
    const sendId = (await fetchPost({
        model: "Esed_Send",
        method: "create",
        data: {
            status: authorSend.ok,
            user,
            message: (!authorSend.ok) ? authorSend.description : "Сообщение успешно отправлено"
        }
    }, '/api/database/mongodb')).response._id
    return {
        send: (authorSend.ok) ? 1 : 0,
        id: sendId
    }
}