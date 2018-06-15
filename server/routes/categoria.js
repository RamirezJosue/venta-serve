const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ==========================================
// Obtener todo Categoria
// ==========================================
app.get('/categoria', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categoria',
                        errors: err
                    });
                }

                Categoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias,
                        total: conteo
                    });
                });
            });
});

// ==========================================
//  Obtener Categoria por ID
// ==========================================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Categoria con el id ' + id + 'no existe',
                    errors: { message: 'No existe un categoria con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                categoria: categoria
            });
        })
})


// ==========================================
// Actualizar categoria
// ==========================================
app.put('/categoria/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoria) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe un categoria con ese ID' }
            });
        }


        categoria.nombre = body.nombre;
        categoria.descripcion = body.descripcion;

        categoria.save((err, categoriaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo categoria
// ==========================================
app.post('/categoria', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    categoria.save((err, categoriaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado,
        });


    });

});


// ============================================
//   Borrar categoria por el id
// ============================================
app.delete('/categoria/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar categoria',
                errors: err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un categoria con ese id',
                errors: { message: 'No existe un categoria con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });

    });

});


module.exports = app;