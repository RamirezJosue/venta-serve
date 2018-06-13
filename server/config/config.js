// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/venta';
} else {
    urlDB = 'mongodb://venta:963518495ramirez@ds213209.mlab.com:13209/venta';
}
process.env.URLDB = urlDB;