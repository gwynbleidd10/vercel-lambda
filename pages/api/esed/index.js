const path = require('path')

const User = require('../../../models/User')
const Input = require('../../../models/Input')
const Send = require('../../../models/Send')
const Status = require('../../../models/Status')

module.exports = (req, res) => {
    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: 'WebHook for TG bot',
        })
    }
    else {
        res.json({
            status: 200,
            status: 'OK'
        });
        processing()
    }
}

async function processing() {
    let list = [], arr = [], stat = [], authors, user, send, tmp = ''
    const input = await Input.create(data)
    let status = {
        type: '',
        from: '',
        dept: '',
        to: 0,
        send: '',
        input: input._id
    }
    let str = `<a href=\"${data.url}\">${data.title}</a>\n================\n<a href="tg://user?id=${data.from}">`
    const info = await User.findOne({ tg: data.from })
    //let tmp = (info != null) ? info.name : "Неизвестный пользователь"
    console.log(info.name, data.type, data.title)
    status.from = info.name
    status.dept = info.dept
    str += info.name + "</a> "
    status.type = (data.type == 'visa') ? 'Визирование' : (data.type == 'sign') ? 'Подпись' : (data.type == 'visa-send') ? 'Отправка на визирование' : (data.type == 'sign-send') ? 'Отправка на подпись' : (data.type == 'resolution') ? 'Поручение' : (data.type == 'answer') ? 'Отчёт' : 'Иное'
    //Проверка типа сообщения
    if (data.type == 'visa' || data.type == 'sign') {
        //{title, url, type, from, author, status, [comment]}
        str += ((data.type == 'visa') ? `<i>завизировал(а)` : `<i>подписал(а)`) + `</i>\n================\n<i>${data.status}</i>`
        str += (data.comment != undefined) ? `\n================\n<i>Комментарий</i>: ${data.comment}` : ''
        authors = data.author.split(',')
        tmp = []
        for (let i = 0; i < authors.length; i++) {
            user = await User.findOne({ name: authors[i] })
            if (user != null) {
                status.send = await check(data, user, str)
                if (status.send.status) {
                    status.to = 1
                }
                tmp.push({ user: authors[i], send: status.send })
            }
        }
        send = await Send.create({ ...tmp })
        status.send = send._id
        await Status.create(status)
    }
    else if (data.type == 'visa-send' || data.type == 'sign-send') {
        //{title, url, type, from, list}
        if (info == null || !info.super) {  //Проверка на Марину
            str += ((data.type == 'visa-send') ? `отправил(а) на <i>визу` : `отправил(а) на <i>подпись`) + `</i>\n================`
            authors = data.list.split(',')
            tmp = ''
            for (let i = 0; i < authors.length; i++) {
                user = await User.findOne({ name: authors[i] })
                if (user != null) {
                    tmp += '\n' + ((user.tg != '') ? `<a href="tg://user?id=${user.tg}">${authors[i]}</a>` : authors[i])
                    list.push(user.tg)
                }
                else {
                    tmp += '\n' + authors[i]
                }
            }
            for (let i = 0; i < list.length; i++) {
                user = await User.findOne({ tg: list[i] })
                status.send = await check(data, user, str + tmp)
                if (status.send.status) {
                    status.to = 1
                }
                arr.push({ user: user.name, send: status.send })
            }
            send = await Send.create((list.length > 0) ? { ...arr } : { message: "Ни одного пользователя нет в справочнике" })
            status.send = send._id
            await Status.create(status)
        }
    }
    else if (data.type == 'resolution') {
        //{title, url, type, from, list {title, list, [date]}}
        let ctrl = 0
        str += 'назначил(а) <i>поручение</i>\n================'
        for (let i = 0; i < data.list.length; i++) {
            status.res = data.list.length
            if (data.list[i].control == "true") {
                ctrl++
                tmp = ''
                tmp += '\nПоручение: <i>' + data.list[i].title + '</i>\n================\nСрок: <i>' + data.list[i].date + '</i>\n================'
                authors = data.list[i].list.split(',')
                list = []
                for (let i = 0; i < authors.length; i++) {
                    user = await User.findOne({ name: (authors[i][0] == ('(')) ? authors[i].substr(7, authors[i].length - 7) : (authors[i][0] == ('+')) ? authors[i].substr(2, authors[i].length - 2) : authors[i] })
                    if (user != null) {
                        tmp += '\n' + ((user.tg != '') ? `<a href="tg://user?id=${user.tg}">${authors[i]}</a>` : authors[i])
                        list.push(user.tg)
                    }
                    else {
                        tmp += '\n' + authors[i]
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    user = await User.findOne({ tg: list[i] })
                    status.send = await check(data, user, str + tmp)
                    if (status.send.status) {
                        status.to += 1
                    }
                    stat.push({ user: user.name, send: status.send })
                }
                arr.push((list.length > 0) ? stat : { message: "Ни одного пользователя нет в справочнике" })
            }
            else {
                arr.push({ message: "Неконтрольное поручение" })
            }
        }
        status.ctrl = ctrl
        send = await Send.create({ ...arr })
        status.send = send._id
        await Status.create(status)
    }
    else {
        //{title, url, type, from, author, status, text}
        if (info == null || !info.super) { //Проверка на Марину            
            str += `<i>ввел(а) отчет:</i>\n================\nСтатус: <i>${data.status}</i>\n================\n`
            user = await User.findOne({ name: data.author })
            status.send = await check(data, user, str)
            if (status.send.status) {
                status.to = 1
            }
            send = await Send.create(status.send)
            status.send = send._id
            await Status.create(status)
        }
    }
}

function visaSign() {

}

function sendVisaSign() {

}

function resolutiion() {

}

function reply() {

}

async function check(data, info, str) {
    let reg = new RegExp(/.*ознакомлен.*/i)
    if (info != null) {
        if (info.tg == '') {
            return { status: false, message: 'У пользователя не задан Telegram ID' }
        }
        if (data.from == info.tg) {
            return { status: false, message: 'Отправка самому себе' }
        }
        if (data.type == 'answer') {
            if (info.super) {
                return await sendMessage((!process.env.NODE_ENV) ? "debug" : info.tg, (data.text != undefined) ? str += data.text : str += 'Введен пустой отчет!')
            }
            else {
                if (data.text != undefined && !reg.test(data.text.substring(0, 10).toLowerCase())) {
                    return await sendMessage((!process.env.NODE_ENV) ? "debug" : info.tg, str += data.text)
                }
                else {
                    return { status: false, message: 'Ознакомление' }
                }
            }
        }
        else {
            return await sendMessage((!process.env.NODE_ENV) ? "debug" : info.tg, str)
        }
    }
    else {
        return { status: false, message: 'Пользователя нет в справочнике' }
    }
}