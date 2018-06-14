const express = require('express');

const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const Usuario = require('../models/usuario');
const Articulo = require('../models/articulo');

// default options
app.use(fileUpload());

// Rutas
app.put('/upload/:tipo/:id', (req, res, next) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // tipos de  coleccion
    let tiposValidos = ['articulos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valido',
            errors: { message: 'Tipo de coleccion no es valido' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path
    let path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            let pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            })
        });

    }

    if (tipo === 'articulos') {

        Articulo.findById(id, (err, articulo) => {
            let pathViejo = './uploads/articulos/' + articulo.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            articulo.img = nombreArchivo;

            articulo.save((err, articuloActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de articulo actualizado',
                    articulo: articuloActualizado
                });
            })
        });

    }

}

module.exports = app;