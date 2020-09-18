const mongoose = require('mongoose')

const { fetchPost } = require('../../../utils/fetchPost')
const { cors } = require('../../../utils/cors')
const { Models } = require('../../../models')

/*
db: String,
model: String,
method: String,
data: Object
*/

mongoose.Promise = global.Promise
let isConnected

connectToDatabase = async () => {
    if (isConnected) {
        // console.log('=> using existing database connection')
        return Promise.resolve()
    }
    // console.log('=> using new database connection');
    return mongoose.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@${process.env.MDB_SERVER}/${process.env.MDB_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(conn => {
        isConnected = conn.connections[0].readyState
    })
}

objectCheck = async (data) => {
    let result = data
    return Promise.all(
        Object.entries(result).map((ent) => {
            if (Array.isArray(ent[1])) {
                let tmp = []
                Promise.all(
                    ent[1].map((val) => {
                        tmp.push(val.toString().replace('ObjectId=', ''))
                    })
                ).then(() => {
                    result[ent[0]] = tmp
                })
            }
            else {
                result[ent[0]] = (ent[1]) ? ent[1].toString().replace('ObjectId=', '') : ent[1]
            }
        })
    ).then(() => {
        return result
    })
}

module.exports = async (req, res) => {
    await cors(req, res)
    if (req.method == 'GET') {
        res.json({
            status: 200,
            message: 'MongoDB API',
        })
    }
    else {
        let data = {
            status: 200,
            response: ''
        }
        try {
            await connectToDatabase()
            //let body = req.body.data
            let body
            if (req.body.data) {
                body = await objectCheck(req.body.data)
            }
            switch (req.body.method) {
                case 'create':
                    data.response = await Models[req.body.model].create(body)
                    break;
                case 'find':
                    data.response = await Models[req.body.model].find(body)
                    break;
                case 'findOne':
                    data.response = await Models[req.body.model].findOne(body)
                    break;
                case 'update':
                    data.response = await Models[req.body.model].update(req.body.filter, body)
                    break;
                case 'updateOne':
                    data.response = await Models[req.body.model].updateOne(req.body.filter, body)
                    break;
                case 'existsAndCreate':
                    data.response = await Models[req.body.model].exists(req.body.filter)
                    if (!data.response) {
                        data.response = (await fetchPost({
                            model: req.body.model,
                            method: "create",
                            data: body
                        }, '/api/database/mongodb')).response
                    }
                    break;
                default:
                    data.status = 404
                    data.response = "Method not found"
                    break;
            }
            res.json(data)
        } catch (err) {
            res.json({
                status: 500
            })
            console.error(err)
        }
    }
}