const mongoose = require("mongoose");

const conexion = async() => {
    try {
        mongoose.connect("mongodb://localhost:27017/nodejs1"); // <- useNewUrlParser: True, useUnifiedTopology: True, useCreateIndex: True. Solo usarlos en caso de algun error de conexin con la base de datos

        console.log("Conectado correctamente a la base de datos 'nodejs1'")
    } catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}


module.exports = {
    conexion
}