const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors")

// Iniciar app
console.log("App de node arrancada");

// Conectar a la base de datos
conexion();

// Crear servidor NodeJS
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // Recibir datos con content-type app/json
app.use(express.urlencoded({ extended:true })) // Ayuda a recibir e interpretar datos que se envian a traves de formato urlencoded

// Ruta de prueba hardcodeada
app.get("/", (request, response) => {
    console.log("Se ha ejecutado el endpoint probando");
    return response.status(200).send(
        "<h1>Empezando a crear un api rest con node</h1>"
        );
});

// RUTAS BUENAS
const rutas_articulo = require("./rutas/articulo");

// Carga de rutas
app.use("/api", rutas_articulo);


// Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});