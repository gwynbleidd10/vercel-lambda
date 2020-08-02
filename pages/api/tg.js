module.exports = (req, res) => {
    res.json({
        "method": "sendMessage",
        "chat_id": req.body.message.chat.id,
        "reply_to_message_id": req.body.message.message_id,
        "text": "Привет"
    })
}