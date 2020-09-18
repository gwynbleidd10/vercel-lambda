const sql = require('mssql')

const config = {
    user: process.env.MSQL_USER,
    password: process.env.MSQL_PASS,
    server: process.env.MSQL_SERVER,
    database: process.env.MSQL_DB,
}

module.exports = async (req, res) => {
    //console.log(req.body)
    try {
        let pool = await sql.connect(config)
        const result = await pool.request().query(req.body.query)
        res.json({
            response: await result
        })
    } catch (err) {
        console.error(err)
    }
}