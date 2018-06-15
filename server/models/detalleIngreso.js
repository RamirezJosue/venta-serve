const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let detalleIngresoSchema = new Schema({
    cantidad: { type: Number, required: [true, 'Cantidad es necesario'] },
    precioVenta: { type: Number, required: [true, 'Precio venta es necesario'] },
    precioCompra: { type: Number, required: [true, 'Precio compra es necesario es necesario'] },
    articulo: { type: Schema.Types.ObjectId, ref: 'Articulo', required: true },
    ingreso: { type: Schema.Types.ObjectId, ref: 'Ingreso', required: true }
});
module.exports = mongoose.model('detalleIngreso', detalleIngresoSchema);