const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let depositoVentaSchema = new Schema({
    monto: { type: String, required: [true, 'Cantidad es necesario'] },
    tipoDeposito: { type: String, required: [true, 'Tipo deposito es necesario'] },
    cuentaDeposito: { type: String, required: [true, 'Cuenta deposito es necesario'] },
    fechaHora: { type: Date, required: true, default: Date.now },
    venta: { type: Schema.Types.ObjectId, ref: 'Venta', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});
module.exports = mongoose.model('depositoVenta', depositoVentaSchema);