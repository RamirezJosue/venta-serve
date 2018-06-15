const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let DepositoVenta = require('../models/depositoVenta');

// ==========================================
// Obtener todo DepositoVenta
// ==========================================
app.get('/depositoVenta', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    DepositoVenta.find({})
        .skip(desde)
        .limit(5)
        .populate('venta')
        .populate('usuario')
        .exec(
            (err, depositoVentas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando deposito venta',
                        errors: err
                    });
                }

                DepositoVenta.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        depositoVentas,
                        total: conteo
                    });
                })
            });
});


// ==========================================
// Actualizar depositoVenta
// ==========================================
app.put('/depositoVenta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    DepositoVenta.findById(id, (err, depositoVenta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar depositoVenta',
                errors: err
            });
        }

        if (!depositoVenta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El deposito venta con el id ' + id + ' no existe',
                errors: { message: 'No existe un deposito venta con ese ID' }
            });
        }


        depositoVenta.monto = body.monto;
        depositoVenta.tipoDeposito = body.tipoDeposito;
        depositoVenta.cuentaDeposito = body.cuentaDeposito;


        depositoVenta.save((err, depositoVentaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar depositoVenta',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                depositoVenta: depositoVentaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo depositoVenta
// ==========================================
app.post('/depositoVenta', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let depositoVenta = new DepositoVenta({
        monto: body.monto,
        tipoDeposito: body.tipoDeposito,
        cuentaDeposito: body.cuentaDeposito,
        fechaHora: body.fechaHora,
        venta: body.venta,
        usuario: req.usuario._id
    });

    depositoVenta.save((err, depositoVentaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear depositoVenta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            depositoVenta: depositoVentaGuardado,
        });


    });

});


// ============================================
//   Borrar depositoVenta por el id
// ============================================
app.delete('/depositoVenta/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    DepositoVenta.findByIdAndRemove(id, (err, depositoVenta) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar depositoVenta',
                errors: err
            });
        }

        if (!depositoVenta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un depositoVenta con ese id',
                errors: { message: 'No existe un depositoVenta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            depositoVenta: depositoVenta
        });

    });

});


module.exports = app;