require('./config/config');

const express = require('express');
const app = express();


app.get('/usuario', (req, res) => {
    res.json('get Usuario')
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);

})