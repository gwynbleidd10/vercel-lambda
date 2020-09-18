const { Schema, model } = require('mongoose')

const schema = new Schema({
    control: { type: Boolean },
    author: { type: String },
    org: { type: String },
    dept: { type: String },
    date: { type: String, default: (new Date(Date.now() - (-32400000))).getTime() }
}, { versionKey: false })

try {
    module.exports = model('Esed_Res')
} catch (err) {
    module.exports = model('Esed_Res', schema)
}