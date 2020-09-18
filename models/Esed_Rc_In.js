const { Schema, model } = require('mongoose')

const schema = new Schema({
    rc: { type: String, unique: true },
    org: { type: String },
    signer: { type: String },
    date: { type: String, default: (new Date(Date.now() - (-32400000))).getTime() }
}, { versionKey: false })

try {
    module.exports = model('Esed_Rc_In')
} catch (err) {
    module.exports = model('Esed_Rc_In', schema)
}