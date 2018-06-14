const express = require('express');

const app = express();

const Venta = require('../models/venta');
const Usuario = require('../models/usuario');
const Persona = require('../models/persona');
const Ingreso = require('../models/ingreso');
const DetalleVenta = require('../models/detalleVenta');
const DetalleIngreso = require('../models/detalleIngreso');
const Categoria = require('../models/categoria');
const Articulo = require('../models/articulo');


//===================================
// Busqueda por coleccion
//===================================

app.get('/busqueda/coleccion/:tabla/:busqueda', (req, res) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regex = new RegExp(busqueda, 'i');

    let promesa;

    switch (tabla) {
        case 'ventas':
            promesa = buscarVentas(busqueda, regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'personas':
            promesa = buscarPersonas(busqueda, regex);
            break;
        case 'ingresos':
            promesa = buscarIngresos(busqueda, regex);
            break;
        case 'categorias':
            promesa = buscarCategorias(busqueda, regex);
            break;
        case 'articulos':
            promesa = buscarArticulos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })
})

//===================================
// Busqueda general
//===================================

app.get('/busqueda/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarVentas(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarPersonas(busqueda, regex),
            buscarCategorias(busqueda, regex),
            buscarArticulos(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                ventas: respuestas[0],
                usuarios: respuestas[1],
                personas: respuestas[2],
                categorias: respuestas[3],
                articulos: respuestas[4]

            });
        });

});

function buscarVentas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Venta.find({ 'tipoComprobante': regex })
            .populate('usuario', 'nombre')
            .exec((err, ventas) => {
                if (err) {
                    reject('Error al cargar ventas', err);
                } else {
                    resolve(ventas)
                }
            });
    });

}



function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre direccion role')
            .or([{ 'nombre': regex }, { 'direccion': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

function buscarPersonas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Persona.find({}, 'nombre email')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, personas) => {
                if (err) {
                    reject('Error al cargar personas', err);
                } else {
                    resolve(personas);
                }
            });
    });

}

function buscarCategorias(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Categoria.find({ 'nombre': regex }, (err, categorias) => {
            if (err) {
                reject('Error al cargar categorias', err);
            } else {
                resolve(categorias)
            }
        });
    });

}

function buscarArticulos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Articulo.find({}, 'nombre codigo')
            .or([{ 'nombre': regex }, { 'codigo': regex }])
            .exec((err, articulos) => {
                if (err) {
                    reject('Error al cargar articulos', err);
                } else {
                    resolve(articulos);
                }
            });
    });

}



module.exports = app;