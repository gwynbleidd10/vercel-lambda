const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        const count = (await fetchPost({
            query: `SELECT count(note) as count from USER_CL WHERE DELETED = 0 and ${req.body.query}`
        }, '/api/database/mssql')).response
        res.json({
            response: (count.recordset.length > 0) ? count.recordset[0]['count'] : null
        })
    } catch (err) {
        console.error(err)
    }
}