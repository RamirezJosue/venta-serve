const mongoose = require('mongoose');

let Shema = mongoose.Schema;

let personaShema = new Shema({
    tipoPersona: { type: String, required: [true, 'El tipo de persona es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipoDocumento: { type: String, required: false },
    numDocumento: { type: String, required: false },
    direccion: { type: String, required: false },
    telefono: { type: String, required: false },
    email: { type: String, unique: true, required: false }

});

module.exports = mongoose.model('Persona', personaShema);