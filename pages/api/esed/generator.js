const path = require('path')
const { cors } = require('../../../utils/cors')
const { fetchPost } = require('../../../utils/fetchPost')

const excel = require('xlsx-populate')

module.exports = async (req, res) => {
    await cors(req, res)
    //res.setHeader("Content-Disposition", `attachment; filename="main.xlsx"`)
    //res.send(await report())
    res.json({
        status: 200,
        name: await report()
    })
}

async function report() {
    let timerStart = new Date()
    // let date = new Date().toLocaleDateString('ru', { timeZone: 'Asia/Yakutsk', hour12: false, day: '2-digit', month: '2-digit', year: 'numeric' }).split('-')
    // date = `${date[2]}.${date[1]}.${date[0]}`
    let date = new Date().toLocaleDateString('ru', { timeZone: 'Asia/Yakutsk', hour12: false, day: '2-digit', month: '2-digit', year: 'numeric' })

    let ogv, omsu, gos, gosNum = 536;
    let workbook = await excel.fromFileAsync(path.join(process.cwd(), `/public/templates/esed/main.xlsx`));
    try {
        //Sheet 0
        ogv = (await fetchPost({
            query: `left(note,4) > '0000' and left(note,4) < '0100'`
        }, '/api/esed/user/count')).response
        omsu = (await fetchPost({
            query: `left(note,4) > '0099' and left(note,4) < '0200'`
        }, '/api/esed/user/count')).response
        console.log('Sheet 0 rdy - ' + (new Date() - timerStart));

        //Sheet 1
        rows = workbook.sheet(1)._rows;
        workbook.sheet(1).range(`C2:C${rows.length - 1}`).style("numberFormat", "0");
        for (let i = 1; i < rows.length; i++) {
            if (!isNaN(rows[i]._cells[1].value())) {
                tmp = (await fetchPost({
                    query: `left(note,7) LIKE '${rows[i]._cells[1].value()}%'`
                }, '/api/esed/user/count')).response
                rows[i]._cells[3].value(tmp)
            }
            if (i == (rows.length - 1)) {

                workbook.sheet(1).cell(`C${rows.length - 1}`).formula(`=SUM(C2:C${rows.length - 2})`);
            }
        };
        console.log('Sheet 1 rdy - ' + (new Date() - timerStart));

        //Sheet 2
        rows = workbook.sheet(2)._rows;
        workbook.sheet(2).range(`C2:C${rows.length - 1}`).style("numberFormat", "0");
        for (let i = 1; i < rows.length; i++) {
            if (!isNaN(rows[i]._cells[1].value())) {
                tmp = (await fetchPost({
                    query: `left(note,7) LIKE '${rows[i]._cells[1].value()}%'`
                }, '/api/esed/user/count')).response
                rows[i]._cells[3].value(tmp)
            }
            if (i == (rows.length - 1)) {
                workbook.sheet(2).cell(`C${rows.length - 1}`).formula(`=SUM(C2:C${rows.length - 2})`);
            }
        };
        console.log('Sheet 2 rdy - ' + (new Date() - timerStart));

        //Sheet 3
        let sum = 0, org = 0;
        rows = workbook.sheet(3)._rows;
        workbook.sheet(3).range(`E2:E${rows.length - 1}`).style("numberFormat", "0");
        for (let i = 1; i < rows.length; i++) {
            if (!isNaN(rows[i]._cells[3].value())) {
                tmp = (await fetchPost({
                    query: `left(note,7) LIKE '${rows[i]._cells[3].value()}%'`
                }, '/api/esed/user/count')).response
                rows[i]._cells[5].value(tmp)
                sum += tmp
                org++
            }
            if (i == (rows.length - 1)) {
                workbook.sheet(3).cell(`E${rows.length - 1}`).formula(`=SUM(E2:E${rows.length - 2})`)
                gos = sum
                workbook.sheet(3).cell(`F${rows.length - 1}`).formula(`=SUM(F2:F${rows.length - 2})`)
                gosNum = org
                workbook.sheet(3).cell(`G${rows.length - 1}`).formula(`=SUM(G2:G${rows.length - 2})`)
            }
        };
        console.log('Sheet 3 rdy - ' + (new Date() - timerStart));

        workbook.sheet(0).find(/%ALL%+/g, `Во исполнение Указа Главы Республики Саха (Якутия) от 30 декабря 2018 года № 312 «О единой системе электронного документооборота» (далее, Указ), по состоянию на ${date} зарегистрировано ${ogv + omsu + gos} ед. учетных записей пользователей ЕСЭД, в том числе:`);
        workbook.sheet(0).find(/%OGV%+/g, `подключение к ЕСЭД органов государственной власти Республики Саха (Якутия) выполнено в полном объеме, выдано ${ogv} ед. учетных записей пользователей`);
        workbook.sheet(0).find(/%OMSU%+/g, `подключение к ЕСЭД органов муниципальной власти Республики Саха (Якутия) выполнено в объеме уровня администраций муниципальных районов, выдано ${omsu} ед. учетных записей пользователей`);
        workbook.sheet(0).find(/%GOS%+/g, `для государственных учреждений Республики Саха (Якутия), государственных унитарных предприятий Республики Саха (Якутия), подлежащих подключению к ЕСЭД во исполнение п.2 Указа, выдано ${gos} ед. учетных записей пользователей ЕСЭД, подключено ${gosNum} ед. учреждений и организаций.`);
    } catch (err) {
        console.log(err);
    }
    workbook.sheet(0).active(true)

    let timerEnd = new Date() - timerStart;
    console.info('Execution time: %dms', timerEnd);
    // return workbook.outputAsync()
    //     .then(function (blob) {
    //         return blob
    //     })
    const name = `main_${new Date().getTime()}.xlsx`
    await workbook.toFileAsync(path.join(process.cwd(), `/public/reports/esed/${name}`))
    return name
}