const mongoose = require('mongoose');

let Shema = mongoose.Schema;

let unidadMedidaShema = new Shema({
    nombre: { type: String, required: [true, 'Nombre es obligatorio'] },
    prefijo: { type: String, required: [true, 'Prefijo es obligatorio'] },
    condicion: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('UnidadMedida', unidadMedidaShema);