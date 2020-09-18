const { Schema, model } = require('mongoose')

const schema = new Schema({
    key: { type: String, unique: true },
    value: { type: Schema.Types.Mixed }
}, { versionKey: false, strict: false })

try {
    module.exports = model('Config')
} catch (err) {
    module.exports = model('Config', schema)
}