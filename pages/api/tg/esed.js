// const mongoose = require('mongoose')

// // const TelegramBot = require('node-telegram-bot-api')
// // const bot = new TelegramBot(process.env.BOT_TEST, { webHook: true })



// let data = {
//     "chat_id": "337277275",
//     "text": "test"
// }

module.exports = async (req, res) => {
    console.log(req)
    if (req.method == 'GET') {
        const r = await fetch('https://api.telegram.org/bot1008172330:AAFR-qVaUe2S1_mcY8x1QxXY6i-AnUGe6DQ/sendMessage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        res.json({
            status: 200,
            message: await r,
        })
    }
    else {
        console.log(req.body)
        res.json({
            "method": "sendMessage",
            "chat_id": req.body.message.chat.id,
            "reply_to_message_id": req.body.message.message_id,
            "text": req.body.message
            //user
        })
        // bot.onText('message', (msg) => {
        //     //sendMessage(msg.from.id, start(msg.from.id))
        //     //checkId(msg.from.id)
        //     bot.sendMessage(req.body.message.chat.id, msg)
        // })
    }
}

function info(id) {
    let str = '<b>Ваш Telegram ID</b> = <i>' + id + '</i>\n\n'
    str += 'Для установки скрипта требуется:\n'
    str += '1)Установить расширение Tampermonkey для своего браузера по <a href="https://www.tampermonkey.net">ссылке</a>\n'
    str += '2)Перейти по <a href="https://github.com/gwynbleidd10/userscripts/raw/master/ESEDtoTG.user.js">ссылке</a> и установить скрипт\n'
    str += '3)Включить расширение и включить скрипт! При следующем заходе на сайт ESED\'а скрипт попросит ввести полученый Telegram ID от бота.'
    return str
}