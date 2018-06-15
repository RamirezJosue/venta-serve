const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let detalleVentaSchema = new Schema({
    cantidad: { type: Number, required: [true, 'Cantidad es necesario'] },
    precioVenta: { type: Number, required: [true, 'Precio venta es necesario'] },
    descuento: { type: Number, required: [true, 'Descuento es necesario es necesario'] },
    cuentaVenta: { type: String, required: [true, 'Cuenta venta es necesario es necesario'] },
    tipoIgv: { type: String, required: [true, 'Tipo igv es necesario es necesario'] },
    igv: { type: String, required: [true, 'Igv es necesario es necesario'] },
    venta: { type: Schema.Types.ObjectId, ref: 'Venta', required: true },
    articulo: { type: Schema.Types.ObjectId, ref: 'Articulo', required: true }
});
module.exports = mongoose.model('detalleVenta', detalleVentaSchema);