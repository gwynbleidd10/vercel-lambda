const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        let department = (await fetchPost({
            query: `SELECT SURNAME_PATRON FROM USER_CL WHERE ISN_LCLASSIF = (SELECT INS_WHO FROM PRJ_RC WHERE ISN_PRJ = '${req.body.id}')`
        }, '/api/database/mssql')).response
        res.json({
            response: (department.recordset.length > 0) ? await department.recordset[0]['SURNAME_PATRON'] : null
        })
    } catch (err) {
        console.error(err)
    }
}