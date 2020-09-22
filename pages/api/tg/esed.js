
// // const TelegramBot = require('node-telegram-bot-api')
// // const bot = new TelegramBot(process.env.BOT_TEST, { webHook: true })

const { cors } = require('../../../utils/cors')
const { fetchPost } = require('../../../utils/fetchPost')

// let data = {
//     "chat_id": "337277275",
//     "text": "test"
// }

module.exports = async (req, res) => {
    await cors(req, res)
    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: "GET",
        })
    }
    else {
        // res.json({
        //     "method": "sendMessage",
        //     "parse_mode": "html",
        //     "disable_web_page_preview": true,
        //     "chat_id": req.body.message.chat.id,
        //     "reply_to_message_id": req.body.message.message_id,
        //     "text": info(req.body.message.chat.id)
        // })

        // const result = (await fetchPost({
        //     bot: "esed-prod",
        //     message: {
        //         parse_mode: "html",
        //         disable_web_page_preview: true,
        //         chat_id: req.body.message.chat.id,
        //         text: info(req.body.message.chat.id)
        //     }
        // }, '/api/tg/sendMessage')).response
        // res.json(result)

        const command = /^/i
        if (req.body.message.text){
            
        }
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