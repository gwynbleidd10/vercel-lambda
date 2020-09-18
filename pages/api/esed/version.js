const { cors } = require('../../../utils/cors')

const { fetchPost } = require('../../../utils/fetchPost')

module.exports = async (req, res) => {
    await cors(req, res)
    res.json({
        version: (await fetchPost({
            model: "Config",
            method: "findOne",
            key: "EsedVersion"
        }, '/api/database/mongodb')).response.value
    })
    if (req.query.name) {
        const user = (await fetchPost({
            model: "Esed_User",
            method: "findOne",
            data: {
                tg: req.query.tg
            }
        }, '/api/database/mongodb')).response
        if (user) {
            await fetchPost({
                model: "Esed_User",
                method: "updateOne",
                filter: {
                    tg: req.query.tg
                },
                data: {
                    name: req.query.name,
                    dept: (await fetchPost({
                        name: req.query.name
                    }, '/api/esed/department')).response,
                    org: (await fetchPost({
                        name: req.query.name
                    }, '/api/esed/organization')).response,
                }
            }, '/api/database/mongodb')
        }
    }
}