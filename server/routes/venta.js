const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Venta = require('../models/venta');

// ==========================================
// Obtener todos los ventas
// ==========================================
app.get('/venta', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Venta.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre')
        .populate('cliente')
        .exec(
            (err, ventas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando venta',
                        errors: err
                    });
                }

                Venta.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        ventas,
                        total: conteo
                    });
                })



            });
});

// ==========================================
// Obtener Venta por Id
// ==========================================
app.get('/venta/:id', (req, res) => {

    var id = req.params.id;

    Venta.findById(id)
        .populate('cliente', 'nombre')
        .exec((err, venta) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar venta',
                    errors: err
                });
            }

            if (!venta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El venta con el id ' + id + ' no existe',
                    errors: { message: 'No existe un venta con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                venta: venta
            });

        })


});



// ==========================================
// Actualizar venta
// ==========================================
app.put('/venta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Venta.findById(id, (err, venta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar venta',
                errors: err
            });
        }

        if (!venta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El venta con el id ' + id + ' no existe',
                errors: { message: 'No existe un venta con ese ID' }
            });
        }


        venta.tipoComprobante = body.tipoComprobante;
        venta.serieComprobante = body.serieComprobante;
        venta.numComprobante = body.numComprobante;
        venta.impuesto = body.impuesto;
        venta.totalVenta = body.totalVenta;
        venta.cuentaCliente = body.cuentaCliente;
        venta.cuentaIgv = body.cuentaIgv;
        venta.tipoVenta = body.tipoVenta;
        venta.plazo = body.plazo;
        venta.estado = body.estado;


        venta.save((err, ventaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar venta',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                venta: ventaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo venta
// ==========================================
app.post('/venta', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let venta = new Venta({
        tipoComprobante: body.tipoComprobante,
        serieComprobante: body.serieComprobante,
        numComprobante: body.numComprobante,
        fechaHora: body.fechaHora,
        impuesto: body.impuesto,
        totalVenta: body.totalVenta,
        cuentaCliente: body.cuentaCliente,
        cuentaIgv: body.cuentaIgv,
        tipoVenta: body.tipoVenta,
        plazo: body.plazo,
        estado: body.estado,
        usuario: req.usuario._id,
        cliente: body.cliente
    });

    venta.save((err, ventaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear venta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            venta: ventaGuardado,
        });


    });

});


// ============================================
//   Borrar venta por el id
// ============================================
app.delete('/venta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Venta.findByIdAndRemove(id, (err, ventaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar venta',
                errors: err
            });
        }

        if (!ventaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un venta con ese id',
                errors: { message: 'No existe un venta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            venta: ventaBorrado
        });

    });

});


module.exports = app;