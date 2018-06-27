const express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Unidadmedida = require('../models/unidadmedida');

// ==========================================
// Obtener todo unidadmedida
// ==========================================
app.get('/unidadmedida', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Unidadmedida.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, unidadmedidas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando unidadmedida',
                        errors: err
                    });
                }

                Unidadmedida.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        unidadmedidas,
                        total: conteo
                    });
                });
            });
});

// ==========================================
//  Obtener unidadmedida por ID
// ==========================================
app.get('/unidadmedida/:id', (req, res) => {

    let id = req.params.id;

    Unidadmedida.findById(id)
        .exec((err, unidadmedida) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar unidad medida',
                    errors: err
                });
            }

            if (!unidadmedida) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Unidad nedida con el id ' + id + 'no existe',
                    errors: { message: 'No existe un unidad medida con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                unidadmedida: unidadmedida
            });
        })
})


// ==========================================
// Actualizar unidadmedida
// ==========================================
app.put('/unidadmedida/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Unidadmedida.findById(id, (err, unidadmedida) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar unidadmedida',
                errors: err
            });
        }

        if (!unidadmedida) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El unidadmedida con el id ' + id + ' no existe',
                errors: { message: 'No existe un unidadmedida con ese ID' }
            });
        }


        unidadmedida.nombre = body.nombre;
        unidadmedida.descripcion = body.descripcion;

        unidadmedida.save((err, unidadmedidaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar unidadmedida',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                unidadmedida: unidadmedidaGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo unidadmedida
// ==========================================
app.post('/unidadmedida', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let unidadmedida = new Unidadmedida({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    unidadmedida.save((err, unidadmedidaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear unidadmedida',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            unidadmedida: unidadmedidaGuardado,
        });


    });

});


// ============================================
//   Borrar uindadmedida por el id
// ============================================
app.delete('/uindadmedida/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Unidadmedida.findByIdAndRemove(id, (err, unidadmedidaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar unidadmedida',
                errors: err
            });
        }

        if (!unidadmedidaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un unidadmedida con ese id',
                errors: { message: 'No existe un unidadmedida con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            unidadmedida: unidadmedidaBorrado
        });

    });

});


module.exports = app;