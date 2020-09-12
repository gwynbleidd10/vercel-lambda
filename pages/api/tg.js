const mongoose = require('mongoose')

// const TelegramBot = require('node-telegram-bot-api')
// const bot = new TelegramBot(process.env.BOT_TEST, { webHook: true })

const User = require('../../models/User')

module.exports = async (req, res) => {
    console.log(req)
    if (req.method == 'GET') {
        await fetch('https://api.telegram.org/bot1008172330:AAFR-qVaUe2S1_mcY8x1QxXY6i-AnUGe6DQ/sendMessage', {
            method: 'POST',
            body: JSON.stringify({
                chat_id: '337277275',
                text: 'test'
            })
        })
        res.json({
            status: 200,
            message: 'WebHook for TG bot',
        })
    }
    else {
        await mongoose.connect("mongodb+srv://" + process.env.MDB_USER + ":" + process.env.MDB_PASS + "@" + process.env.MDB_CLUSTER + "/" + process.env.MDB_ESED_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        let user = await User.findOne({ tg: req.body.message.chat.id })
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