const { Schema, model } = require('mongoose')

const schema = new Schema({}, { versionKey: false, strict: false })

try {
    module.exports = model('Esed_Input')
} catch (err) {
    module.exports = model('Esed_Input', schema)
}