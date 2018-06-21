const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let ventaSchema = new Schema({
    tipoComprobante: { type: String, required: [true, 'Tipo de combrobante es necesario'] },
    serieComprobante: { type: String, required: [true, 'Serie de comprobante es necesario'] },
    numComprobante: { type: String, required: [true, 'Numero de comprobante es necesario'] },
    fechaHora: { type: Date, required: true, default: Date.now },
    impuesto: { type: Number, required: [true, 'Impuesto es necesario'] },
    totalVenta: { type: Number, required: [true, 'Total venta es necesario'] },
    cuentaCliente: { type: String, required: [true, 'Cuenta cliente es necesario'] },
    cuentaIgv: { type: String, required: [true, 'Cuenta igv es necesario'] },
    tipoVenta: { type: String, required: [true, 'Tipo venta es necesario'] },
    plazo: { type: String, required: false },
    estado: { type: Boolean, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'El	id	persona	es	un	campo	obligatorio'] }
});
module.exports = mongoose.model('Venta', ventaSchema);