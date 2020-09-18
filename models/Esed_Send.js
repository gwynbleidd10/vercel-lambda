const { Schema, model } = require('mongoose')

const schema = new Schema({
    status: { type: Boolean, default: false},
    user: { type: String },
    message: { type: String },
    date: { type: String, default: (new Date(Date.now() - (-32400000))).getTime() }
}, { versionKey: false })

try {
    module.exports = model('Esed_Send')
} catch (err) {
    module.exports = model('Esed_Send', schema)
}