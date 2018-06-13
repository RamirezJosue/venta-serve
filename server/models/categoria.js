var mongoose = require('mongoose');

var Shema = mongoose.Schema;

var categoriaShema = new Shema({
    nombre: { type: String, required: [true, 'Nombre es obligatorio'] },
    descripcion: { type: String, required: false },
    condicion: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Categoria', categoriaShema);