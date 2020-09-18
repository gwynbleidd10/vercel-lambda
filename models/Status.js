const { Schema, model } = require('mongoose')
const { DateTime } = require('mssql')

const schema = new Schema({
    type: { type: String },
    from: { type: String },
    dept: { type: String, default: '' },
    to: { type: Number, default: 0 },
    res: { type: Number, default: 0 },
    ctrl: { type: Number, default: 0 },
    send: { type: Schema.Types.Mixed },
    date: { type: Scheme.Types.DateTime, default: (new Date(Date.now() - (-32400000))) },
    input: { type: Schema.Types.ObjectId, ref: 'Input' }
}, { versionKey: false })

try {
    module.exports = model('Status')
} catch (err) {
    module.exports = model('Status', schema)
}