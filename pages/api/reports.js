import { TemplateHandler } from 'easy-template-x'
const path = require('path')
const fs = require('fs')

import { Lists } from '../../data'

module.exports = async (req, res) => {
    console.log(req.query)

    const formData = JSON.parse(req.query.formdata)

    if (req.query.type == 'esia' || req.query.type == 'smev2' || req.query.type == 'smev3') {
        let data = {
            env: (req.query.env == 'test') ? 'тестов' : (req.query.env == 'prod') ? 'продуктивн' : 'СРЕД',
            memberFullName: Lists.member[Lists.isystem[req.query.is].member].fullname,
            memberShortName: Lists.member[Lists.isystem[req.query.is].member].shortname,
            memberOgrn: (Lists.member[Lists.isystem[req.query.is].member].ogrn) ? Lists.member[Lists.isystem[req.query.is].member].ogrn : 'ОГРН',
            memberCode: (Lists.member[Lists.isystem[req.query.is].member].code) ? Lists.member[Lists.isystem[req.query.is].member].code : 'МНЕМОНИКА',
            memberInn: (Lists.member[Lists.isystem[req.query.is].member].inn) ? Lists.member[Lists.isystem[req.query.is].member].inn : 'ИНН',
            isFullName: (Lists.isystem[req.query.is][req.query.type].fullname) ? Lists.isystem[req.query.is][req.query.type].fullname : 'ПОЛНОЕ_НАИМЕНОВАНИЕ_ИС',
            isShortName: (Lists.isystem[req.query.is][req.query.type].shortname) ? Lists.isystem[req.query.is][req.query.type].shortname : 'КРАТКОЕ_НАИМЕНОВАНИЕ_ИС',
            isCode: (Lists.isystem[req.query.is][req.query.type][req.query.env].code) ? Lists.isystem[req.query.is][req.query.type][req.query.env].code : 'МНЕМОНИКА',
            employeeSurname: (formData.employee) ? Lists.employee[formData.employee].surname : 'ФАМИЛИЯ',
            employeeSurname2: (formData.employee2) ? Lists.employee[formData.employee2].surname : 'ФАМИЛИЯ2',
            employeeName: (formData.employee) ? Lists.employee[formData.employee].name : 'ИМЯ',
            employeeName2: (formData.employee2) ? Lists.employee[formData.employee2].name : 'ИМЯ2',
            employeePatronymic: (formData.employee) ? Lists.employee[formData.employee].patronymic : 'ОТЧЕСТВО',
            employeePatronymic2: (formData.employee2) ? Lists.employee[formData.employee2].patronymic : 'ОТЧЕСТВО2',
            employeeFio: (formData.employee) ? `${Lists.employee[formData.employee].surname} ${Lists.employee[formData.employee].name} ${Lists.employee[formData.employee].patronymic}` : 'ФИО',
            employeeFio2: (formData.employee2) ? `${Lists.employee[formData.employee2].surname} ${Lists.employee[formData.employee2].name} ${Lists.employee[formData.employee2].patronymic}` : 'ФИО2',
            employeePost: (formData.employee) ? Lists.employee[formData.employee].post : 'ДОЛЖНОСТЬ',
            employeePost2: (formData.employee2) ? Lists.employee[formData.employee2].post : 'ДОЛЖНОСТЬ2',
            employeePhone: (formData.employee) ? Lists.employee[formData.employee].phone : 'ТЕЛЕФОН',
            employeePhone2: (formData.employee2) ? Lists.employee[formData.employee2].phone : 'ТЕЛЕФОН2',
            employeeEmail: (formData.employee) ? Lists.employee[formData.employee].email : 'ПОЧТА',
            employeeEmail2: (formData.employee2) ? Lists.employee[formData.employee2].email : 'ПОЧТА2',
            employeeSnils: (formData.employee) ? Lists.employee[formData.employee].snils : 'СНИЛС',
            employeeSnils2: (formData.employee2) ? Lists.employee[formData.employee2].snils : 'СНИЛС2',
            requestsMin: (formData.requestsmin) ? formData.requestsmin : (Lists.isystem[req.query.is][req.query.type].requestsmin) ? Lists.isystem[req.query.is][req.query.type].requestsmin : 'МИНИМАЛЬНОЕ_КОЛВО_ЗАПРОСОВ',
            requestsMax: (formData.requestsmax) ? formData.requestsmax : (Lists.isystem[req.query.is][req.query.type].requestsmax) ? Lists.isystem[req.query.is][req.query.type].requestsmax : 'МАКСИМАЛЬНОЕ_КОЛВО_ЗАПРОСОВ',
            signerPost: (formData.signer) ? Lists.signer[formData.signer].post : 'УПОЛНОМОЧЕННОЕ_ЛИЦО',
        }
        switch (req.query.type) {
            case 'esia':
                data.esiaCode = (Lists.isystem[req.query.is].esia[req.query.env].code) ? Lists.isystem[req.query.is].esia[req.query.env].code : 'МНЕМОНИКА_ЕСИА'
                data.url = (formData.url) ? formData.url : (Lists.isystem[req.query.is].esia.url) ? Lists.isystem[req.query.is].esia.url : 'URL_ГЛАВНОЙ_СТРАНИЦЫ'
                data.cert = req.query.is
                data.scope = (Lists.isystem[req.query.is].esia.scope) ? Lists.isystem[req.query.is].esia.scope : 'СКОУПЫ'
                data.reason = (formData.reason) ? formData.reason : 'ПРИЧИНА'
                break;
            case 'smev2':

                break;
            case 'smev3':
                data.member = `${Lists.member[Lists.isystem[req.query.is].member].fullname}, ${Lists.member[Lists.isystem[req.query.is].member].code}`
                data.is = (Lists.isystem[req.query.is][req.query.type].fullname) ? `${Lists.isystem[req.query.is][req.query.type].fullname}, ${Lists.isystem[req.query.is][req.query.type][req.query.env].code}` : 'НАИМЕНОВАНИЕ_ИС'
                data.coordinator = (formData.coordinator) ? formData.coordinator : (Lists.isystem[req.query.is][req.query.type].coordinator) ? Lists.isystem[req.query.is][req.query.type].coordinator : "МНЕМОНИКИ"
                data.trace = (formData.trace) ? formData.trace : (Lists.isystem[req.query.is][req.query.type].trace) ? Lists.isystem[req.query.is][req.query.type].trace : 'МАРШРУТИЗАЦИЯ'
                data.date = (formData.date) ? formData.date : 'ДД.ММ.ГГГГ ЧЧ:ММ'
                data.mid = (formData.mid) ? formData.mid : 'MESSAGE_ID'
                data.npa = (formData.npa) ? formData.npa : 'НПА'
                data.vs = (formData.vs) ? formData.vs : 'ВИД_СВЕДЕНИЙ, НЕЙМСПЕЙС'
                data.vsLevel = (formData.vslevel) ? formData.vslevel : 'УРОВЕНЬ_ВС'
                data.traceType = (formData.tracetype) ? formData.tracetype : 'ТИП_МАРШРУТИЗАЦИИ'
                data.vsVersion = (formData.vsversion) ? formData.vsversion : 'ВЕРСИЯ_ВС'
                data.multi = (formData.multi) ? formData.multi : 'Нет'
                data.requests = `${data.requestsMin}/${data.requestsMax}`
                data.employee = (formData.employee) ? `${Lists.employee[formData.employee].surname} ${Lists.employee[formData.employee].name} ${Lists.employee[formData.employee].patronymic}, ${Lists.employee[formData.employee].post}, ${Lists.employee[formData.employee].phone}` : 'ОТВЕТСТВЕННЫЙ_СОТРУДНИК'
                break;
        }
        generateReport(data, path.join(process.cwd(), `/public/templates/${req.query.type}/${req.query.report}.docx`), async (doc) => {
            res.setHeader("Content-Disposition", setFilename(Lists.report[req.query.type][req.query.report].name));
            res.send(await doc)
        })
    }
    else {
        res.json({ message: "Выберите тип шаблона!" })
    }
}

async function generateReport(data, path, callback) {
    const templateFile = fs.readFileSync(path);
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, data);
    //fs.writeFileSync('output.docx', doc);
    callback(await doc)
}

function setFilename(filename) {
    return `attachment; filename*=UTF-8\'\'${encodeURIComponent(filename)}.docx`
}