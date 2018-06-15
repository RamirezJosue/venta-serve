const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let articuloSchema = new Schema({
    codigo: { type: String, required: false },
    nombre: { type: String, required: false },
    stock: { type: Number, required: [true, 'El stock es necesario'] },
    tipoIgv: { type: String, required: [true, 'Tipo igv es necesario'] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    condicion: { type: Boolean, required: true, default: false },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true }
});
module.exports = mongoose.model('Articulo', articuloSchema);