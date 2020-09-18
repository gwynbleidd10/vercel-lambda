const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: { type: String, unique: true },
    token: { type: String }
}, { versionKey: false, strict: false })

try {
    module.exports = model('Bot')
} catch (err) {
    module.exports = model('Bot', schema)
}