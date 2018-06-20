const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let UnidadMedida = require('../models/unidadMedida');

// ==========================================
// Obtener todo Unidad de Medida
// ==========================================
app.get('/unidadMedida', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    UnidadMedida.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, unidadMedidas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando unidadMedida',
                        errors: err
                    });
                }

                UnidadMedida.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        unidadMedidas,
                        total: conteo
                    });
                });
            });
});

// ==========================================
//  Mostrar Unidad de Medidad por ID
// ==========================================
app.get('/unidadMedida/:id', (req, res) => {

    let id = req.params.id;

    UnidadMedida.findById(id)
        .exec((err, unidadMedida) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar unidadMedida',
                    errors: err
                });
            }

            if (!unidadMedida) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'UnidadMedida con el id ' + id + 'no existe',
                    errors: { message: 'No existe un unidadMedida con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                unidadMedida: unidadMedida
            });
        })
})


// ==========================================
// Actualizar unidad de medida
// ==========================================
app.put('/unidadMedida/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    UnidadMedida.findById(id, (err, unidadMedida) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar unidadMedida',
                errors: err
            });
        }

        if (!unidadMedida) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El unidadMedida con el id ' + id + ' no existe',
                errors: { message: 'No existe un unidadMedida con ese ID' }
            });
        }


        unidadMedida.nombre = body.nombre;
        unidadMedida.prefijo = body.prefijo;

        unidadMedida.save((err, unidadMedidaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar unidadMedida',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                unidadMedida: unidadMedidaGuardado
            });

        });

    });

});



// ==========================================
// Crear nueva unidad de medida
// ==========================================
app.post('/unidadMedida', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let unidadMedida = new UnidadMedida({
        nombre: body.nombre,
        prefijo: body.prefijo
    });

    unidadMedida.save((err, unidadMedidaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear unidadMedida',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            unidadMedida: unidadMedidaGuardado,
        });


    });

});


// ============================================
//   Borrar unidad de medida por el id
// ============================================
app.delete('/unidadMedida/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    UnidadMedida.findByIdAndRemove(id, (err, unidadMedidaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar unidadMedida',
                errors: err
            });
        }

        if (!unidadMedidaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un unidadMedida con ese id',
                errors: { message: 'No existe un unidadMedida con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            unidadMedida: unidadMedidaBorrado
        });

    });

});


module.exports = app;