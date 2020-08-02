require('dotenv').config()
const mongoose = require('mongoose')

const User = require('../../models/User')

module.exports = async (req, res) => {
    if (req.method == 'GET') {
     
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
            "text": user
        })
    }
}