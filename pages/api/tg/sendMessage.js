
module.exports = async (req, res) => {
    let message = req.body.message
    let token = '1008172330:AAFR-qVaUe2S1_mcY8x1QxXY6i-AnUGe6DQ'
    let url = `https://api.telegram.org/bot${token}/sendMessage`

    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: "Send API",
        })
    }
    else {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        res.json({
            status: 200,
            message: "OK",
        })
    }
}