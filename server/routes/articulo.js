const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Articulo = require('../models/articulo');

// ==========================================
// Obtener todos los articulos
// ==========================================
app.get('/articulo', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Articulo.find({})
        .skip(desde)
        .limit(5)
        .populate('categoria')
        .exec(
            (err, articulos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando persona',
                        errors: err
                    });
                }

                Articulo.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        articulos,
                        total: conteo
                    });
                });
            });
});

// ==========================================
// Actualizar articulo
// ==========================================
app.put('/articulo/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Articulo.findById(id, (err, articulo) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar articulo',
                errors: err
            });
        }

        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo con el id ' + id + ' no existe',
                errors: { message: 'No existe un articulo con ese ID' }
            });
        }


        articulo.codigo = body.codigo;
        articulo.nombre = body.nombre;
        articulo.stock = body.stock;
        articulo.descripcion = body.descripcion;


        articulo.save((err, articuloGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar articulo',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                articulo: articuloGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo articulo
// ==========================================
app.post('/articulo', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let articulo = new Articulo({
        codigo: body.codigo,
        nombre: body.nombre,
        stock: body.stock,
        descripcion: body.descripcion,
        condicion: body.condicion,
        categoria: body.categoria
    });

    articulo.save((err, articuloGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear articulo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            articulo: articuloGuardado,
        });


    });

});


// ============================================
//   Borrar articulo por el id
// ============================================
app.delete('/articulo/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Articulo.findByIdAndRemove(id, (err, articuloBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar articulo',
                errors: err
            });
        }

        if (!articuloBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un articulo con ese id',
                errors: { message: 'No existe un articulo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            articulo: articuloBorrado
        });

    });

});


module.exports = app;