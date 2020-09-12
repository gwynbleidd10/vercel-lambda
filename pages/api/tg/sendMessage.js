
let data = {
    "chat_id": "337277275",
    "text": "test"
}

module.exports = async (req, res) => {
    let token = '1008172330:AAFR-qVaUe2S1_mcY8x1QxXY6i-AnUGe6DQ'
    let url = `https://api.telegram.org/bot${token}/sendMessage`

    if (req.method == 'GET') {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        res.json({
            status: 200,
            message: "Sending",
        })
    }
    else {
        res.json({
            "method": "sendMessage",
            "chat_id": req.body.message.chat.id,
            "reply_to_message_id": req.body.message.message_id,
            "text": req.body.message
            //user
        })
    }
}