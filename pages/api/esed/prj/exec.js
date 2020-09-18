const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        let department = (await fetchPost({
            query: `SELECT SURNAME_PATRON FROM USER_CL WHERE DUE_DEP IN (SELECT DUE_PERSON FROM PRJ_EXEC WHERE ISN_PRJ = '${req.body.id}') AND SURNAME_PATRON  != '${req.body.from}' `
        }, '/api/database/mssql')).response
        res.json({
            response: (department.recordset.length > 0) ? await department.recordset : null
        })
    } catch (err) {
        console.error(err)
    }
}