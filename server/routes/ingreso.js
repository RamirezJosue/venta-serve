const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Ingreso = require('../models/ingreso');

// ==========================================
// Obtener todos los ingresos
// ==========================================
app.get('/ingreso', mdAutenticacion.verificaToken, (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Ingreso.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario')
        .populate('proveedor')
        .exec(
            (err, ingresos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Ingreso',
                        errors: err
                    });
                }

                Ingreso.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        ingresos,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Ingreso por ID
// ==========================================
app.get('/ingreso/:id', (req, res) => {

    let id = req.params.id;

    Ingreso.findById(id)
        .populate('proveedor')
        .populate('usuario', 'nombre')
        .exec((err, ingreso) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ingreso',
                    errors: err
                });
            }

            if (!ingreso) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ingreso con el id ' + id + 'no existe',
                    errors: { message: 'No existe un ingreso con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                ingreso: ingreso
            });
        })
})

// ==========================================
// Actualizar ingreso
// ==========================================
app.put('/ingreso/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Ingreso.findById(id, (err, ingreso) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ingreso',
                errors: err
            });
        }

        if (!ingreso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ingreso con el id ' + id + ' no existe',
                errors: { message: 'No existe un ingreso con ese ID' }
            });
        }


        ingreso.tipoComprobante = body.tipoComprobante;
        ingreso.serieComprobante = body.serieComprobante;
        ingreso.numComprobante = body.numComprobante;
        ingreso.impuesto = body.impuesto;
        ingreso.totalCompra = body.totalCompra;
        ingreso.estado = body.estado;


        ingreso.save((err, ingresoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ingreso',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                ingreso: ingresoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo ingreso
// ==========================================
app.post('/ingreso', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let ingreso = new Ingreso({
        tipoComprobante: body.tipoComprobante,
        serieComprobante: body.serieComprobante,
        numComprobante: body.numComprobante,
        fechaHora: body.fechaHora,
        impuesto: body.impuesto,
        totalCompra: body.totalCompra,
        estado: body.estado,
        usuario: req.usuario._id,
        proveedor: body.proveedor
    });

    ingreso.save((err, ingresoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ingreso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ingreso: ingresoGuardado,
        });


    });

});


// ============================================
//   Borrar ingreso por el id
// ============================================
app.delete('/ingreso/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Ingreso.findByIdAndRemove(id, (err, ingresoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar ingreso',
                errors: err
            });
        }

        if (!ingresoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un ingreso con ese id',
                errors: { message: 'No existe un ingreso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            ingreso: ingresoBorrado
        });

    });

});


module.exports = app;