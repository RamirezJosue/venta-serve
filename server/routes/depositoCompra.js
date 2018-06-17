const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let DepositoCompra = require('../models/depositoCompra');

// ==========================================
// Obtener todo DepositoCompra
// ==========================================
app.get('/depositoCompra', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    DepositoCompra.find({})
        .skip(desde)
        .limit(5)
        .populate('compra')
        .populate('usuario')
        .exec(
            (err, depositoCompras) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando deposito compra',
                        errors: err
                    });
                }

                DepositoCompra.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        depositoCompras,
                        total: conteo
                    });
                })
            });
});


// ==========================================
// Obtener depositoCompra por Id
// ==========================================
app.get('/depositoCompra/:id', (req, res) => {

    var id = req.params.id;

    DepositoCompra.findById(id)
        .populate('compra', 'numComprobante')
        .populate('usuario', 'nombre')
        .exec((err, depositoCompra) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar depositoCompra',
                    errors: err
                });
            }

            if (!depositoCompra) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El depositoCompra con el id ' + id + ' no existe',
                    errors: { message: 'No existe un depositoCompra con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                depositoCompra: depositoCompra
            });

        })


});



// ==========================================
// Actualizar depositoCompra
// ==========================================
app.put('/depositoCompra/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    DepositoCompra.findById(id, (err, depositoCompra) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar depositoCompra',
                errors: err
            });
        }

        if (!depositoCompra) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El deposito compra con el id ' + id + ' no existe',
                errors: { message: 'No existe un deposito compra con ese ID' }
            });
        }


        depositoCompra.monto = body.monto;
        depositoCompra.tipoDeposito = body.tipoDeposito;
        depositoCompra.cuentaDeposito = body.cuentaDeposito;


        depositoCompra.save((err, depositoCompraGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar depositoCompra',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                depositoCompra: depositoCompraGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo depositoCompra
// ==========================================
app.post('/depositoCompra', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let depositoCompra = new DepositoCompra({
        monto: body.monto,
        tipoDeposito: body.tipoDeposito,
        cuentaDeposito: body.cuentaDeposito,
        fechaHora: body.fechaHora,
        compra: body.compra,
        usuario: req.usuario._id
    });

    depositoCompra.save((err, depositoCompraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear depositoCompra',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            depositoCompra: depositoCompraGuardado,
        });


    });

});


// ============================================
//   Borrar depositoCompra por el id
// ============================================
app.delete('/depositoCompra/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    DepositoCompra.findByIdAndRemove(id, (err, depositoCompra) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar depositoCompra',
                errors: err
            });
        }

        if (!depositoCompra) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un depositoCompra con ese id',
                errors: { message: 'No existe un depositoCompra con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            depositoCompra: depositoCompra
        });

    });

});


module.exports = app;