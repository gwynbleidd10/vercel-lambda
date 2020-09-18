const { Schema, model } = require('mongoose')

const schema = new Schema({
    rc: { type: String, unique: true },
    author: { type: String },
    dept: { type: String },
    org: { type: String },
    date: { type: String, default: (new Date(Date.now() - (-32400000))).getTime() }
}, { versionKey: false })

try {
    module.exports = model('Esed_Rc_Out')
} catch (err) {
    module.exports = model('Esed_Rc_Out', schema)
}