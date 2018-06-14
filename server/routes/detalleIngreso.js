const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let DetalleIngreso = require('../models/detalleIngreso');

// ==========================================
// Obtener todo DetalleIngreso
// ==========================================
app.get('/detalleIngreso', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    DetalleIngreso.find({})
        .skip(desde)
        .limit(5)
        .populate('articulo')
        .populate('ingreso')
        .exec(
            (err, detalleIngresos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando persona',
                        errors: err
                    });
                }

                DetalleIngreso.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        detalleIngresos,
                        total: conteo
                    });
                })
            });
});


// ==========================================
// Actualizar detalleIngreso
// ==========================================
app.put('/detalleIngreso/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    DetalleIngreso.findById(id, (err, detalleIngreso) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar detalleIngreso',
                errors: err
            });
        }

        if (!detalleIngreso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El detalleIngreso con el id ' + id + ' no existe',
                errors: { message: 'No existe un detalleIngreso con ese ID' }
            });
        }


        detalleIngreso.cantidad = body.cantidad;
        detalleIngreso.precioVenta = body.precioVenta;
        detalleIngreso.descuento = body.descuento;
        detalleIngreso.articulo = body.articulo;
        detalleIngreso.ingreso = body.ingreso;

        detalleIngreso.save((err, detalleIngresoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar detalleIngreso',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                detalleIngreso: detalleIngresoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo detalleIngreso
// ==========================================
app.post('/detalleIngreso', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let detalleIngreso = new DetalleIngreso({
        cantidad: body.cantidad,
        precioVenta: body.precioVenta,
        descuento: body.descuento,
        articulo: body.articulo,
        ingreso: body.ingreso
    });

    detalleIngreso.save((err, detalleIngresoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear detalleIngreso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            detalleIngreso: detalleIngresoGuardado,
        });


    });

});


// ============================================
//   Borrar detalleIngreso por el id
// ============================================
app.delete('/detalleIngreso/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    DetalleIngreso.findByIdAndRemove(id, (err, detalleIngresoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar detalleIngreso',
                errors: err
            });
        }

        if (!detalleIngresoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un detalleIngreso con ese id',
                errors: { message: 'No existe un detalleIngreso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            detalleIngreso: detalleIngresoBorrado
        });

    });

});


module.exports = app;