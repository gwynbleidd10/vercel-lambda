const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: { type: String, default: '' },
    dept: { type: String, default: null },
    org: { type: String, default: null },
    tg: { type: String, unique: true },
    super: { type: Boolean, default: false }
}, { versionKey: false })

try {
    module.exports = model('Esed_User')
} catch (err) {
    module.exports = model('Esed_User', schema)
}