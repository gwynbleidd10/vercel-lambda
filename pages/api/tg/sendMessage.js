const { fetchPost } = require('../../../utils/fetchPost')
/*
bot: String,
messsage: Object
*/

module.exports = async (req, res) => {
    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: "Send API",
        })
    }
    else {
        let post = (await fetchPost({
            db: "workapi",
            model: "Bot",
            method: "findOne",
            data: {
                name: req.body.bot
            }
        }, '/api/database/mongodb')).response
        const result = await fetchPost(req.body.message, `/bot${post.token}/sendMessage`, 'https://api.telegram.org')
        res.json({
            status: 200,
            response: result,
        })
    }
}