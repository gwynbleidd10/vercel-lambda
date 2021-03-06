const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        const author = (await fetchPost({
            query: `SELECT SURNAME_PATRON FROM USER_CL WHERE DUE_DEP = (SELECT DUE FROM RESOLUTION WHERE ISN_RESOLUTION = '${req.body.id}')`
        }, '/api/database/mssql')).response
        res.json({
            response: (author.recordset.length > 0) ? author.recordset[0]['SURNAME_PATRON'] : null
        })
    } catch (err) {
        console.error(err)
    }
}