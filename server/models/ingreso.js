const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let ingresoSchema = new Schema({
    tipoComprobante: { type: String, required: [true, 'Tipo de combrobante es necesario'] },
    serieComprobante: { type: String, required: [true, 'Serie de comprobante es necesario'] },
    numComprobante: { type: String, required: [true, 'Numero de comprobante es necesario'] },
    fechaHora: { type: Date, required: true, default: Date.now },
    impuesto: { type: Number, required: [true, 'Impuesto es necesario'] },
    totalCompra: { type: Number, required: [true, 'Total compra es necesario'] },
    estado: { type: Boolean, default: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});
module.exports = mongoose.model('Ingreso', ingresoSchema);