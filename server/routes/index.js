const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./persona'));
app.use(require('./categoria'));
app.use(require('./articulo'));
app.use(require('./venta'));
app.use(require('./ingreso'));
app.use(require('./detalleVenta'));
app.use(require('./detalleIngreso'));
app.use(require('./depositoVenta'));
app.use(require('./depositoCompra'));
app.use(require('./busqueda'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./login'));




module.exports = app;