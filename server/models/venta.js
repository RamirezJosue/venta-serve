var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ventaSchema = new Schema({
    tipoComprobante: { type: String, required: [true, 'Tipo de combrobante es necesario'] },
    serieComprobante: { type: String, required: [true, 'Serie de comprobante es necesario'] },
    numComprobante: { type: String, required: [true, 'Numero de comprobante es necesario'] },
    fechaHora: { type: Date, required: true, default: Date.now },
    impuesto: { type: Number, required: [true, 'Impuesto es necesario'] },
    totalVenta: { type: Number, required: [true, 'Total venta es necesario'] },
    estado: { type: String, required: [true, 'Estado es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'El	id	persona	es	un	campo	obligatorio'] }
});
module.exports = mongoose.model('Venta', ventaSchema);