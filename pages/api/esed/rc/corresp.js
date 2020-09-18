const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        let department = (await fetchPost({
            query: `SELECT CLASSIF_NAME FROM ORGANIZ_CL WHERE DUE = (SELECT DUE_ORGANIZ FROM REF_CORRESP WHERE ISN_DOC_INP = '${req.body.id}')`
        }, '/api/database/mssql')).response
        res.json({
            response: (department.recordset.length > 0) ? await department.recordset[0]['CLASSIF_NAME'] : null
        })
    } catch (err) {
        console.error(err)
    }
}