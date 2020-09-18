const { Schema, model } = require('mongoose')

const schema = new Schema({
    type: { type: String },
    from: { type: String },
    dept: { type: String },
    rc: { type: String },
    date: { type: String, default: (new Date(Date.now() - (-32400000))).getTime() },
    send: { type: Number, default: 0 },
    input_id: { type: Schema.Types.ObjectId, ref: 'Esed_Input' },
    send_id: { type: Array, ref: 'Esed_Send' },
    res_id: { type: Array, ref: 'Esed_Res' }
}, { versionKey: false })

try {
    module.exports = model('Request')
} catch (err) {
    module.exports = model('Request', schema)
}