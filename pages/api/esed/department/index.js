const { fetchPost } = require('../../../../utils/fetchPost')
const { cors } = require('../../../../utils/cors')

module.exports = async (req, res) => {
    await cors(req, res)
    try {
        let department = (await fetchPost({
            query: `SELECT DUE_DEP FROM USER_CL WHERE SURNAME_PATRON = '${req.body.name}'`
        }, '/api/database/mssql')).response
        let nodes = await department.recordset[0]['DUE_DEP']
        nodes = nodes.substring(0, nodes.length - 1).split('.')
        nodes.pop()
        let due = nodes.join('.') + '.'
        department = (await fetchPost({
            query: `SELECT CLASSIF_NAME FROM DEPARTMENT WHERE DUE = '${due}'`
        }, '/api/database/mssql')).response
        res.json({
            response: (department.recordset.length > 0) ? await department.recordset[0]['CLASSIF_NAME'] : null
        })
    } catch (err) {
        console.error(err)
    }
}