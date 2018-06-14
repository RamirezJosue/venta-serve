const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let DetalleVenta = require('../models/detalleVenta');

// ==========================================
// Obtener todo DetalleVenta
// ==========================================
app.get('/detalleVenta', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    DetalleVenta.find({})
        .skip(desde)
        .limit(5)
        .populate('venta')
        .populate('articulo')
        .exec(
            (err, detalleVentas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Detalle venta',
                        errors: err
                    });
                }

                DetalleVenta.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        detalleVentas,
                        total: conteo
                    });
                })
            });
});


// ==========================================
// Actualizar detalleVenta
// ==========================================
app.put('/detalleVenta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    DetalleVenta.findById(id, (err, detalleVenta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar detalleVenta',
                errors: err
            });
        }

        if (!detalleVenta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El detalleVenta con el id ' + id + ' no existe',
                errors: { message: 'No existe un detalleVenta con ese ID' }
            });
        }


        detalleVenta.cantidad = body.cantidad;
        detalleVenta.precioVenta = body.precioVenta;
        detalleVenta.descuento = body.descuento;

        detalleVenta.save((err, detalleVentaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar detalleVenta',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                detalleVenta: detalleVentaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo detalleVenta
// ==========================================
app.post('/detalleVenta', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let detalleVenta = new DetalleVenta({
        cantidad: body.cantidad,
        precioVenta: body.precioVenta,
        descuento: body.descuento,
        venta: body.venta,
        articulo: body.articulo
    });

    detalleVenta.save((err, detalleVentaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear detalleVenta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            detalleVenta: detalleVentaGuardado,
        });


    });

});


// ============================================
//   Borrar detalleVenta por el id
// ============================================
app.delete('/detalleVenta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    DetalleVenta.findByIdAndRemove(id, (err, detalleVentaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar detalleVenta',
                errors: err
            });
        }

        if (!detalleVentaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un detalleVenta con ese id',
                errors: { message: 'No existe un detalleVenta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            detalleVenta: detalleVentaBorrado
        });

    });

});


module.exports = app;