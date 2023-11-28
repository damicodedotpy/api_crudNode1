const Articulo = require("../modelos/Articulo");
const {validarArticulo} = require("../helpers/validar");
const fs = require("fs"); // <-- fs = file system
const path = require("path");


const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy un controlador de prueba en mi controlador de articulos"
    })
}

const curso = (req, res) => {
        console.log("Se ha ejecutado el endpoint probando");
        return res.status(200).send([{
            curso: "Master en React",
            autor: "Victor",
            url: "Victor.com"
        },

        {
            curso: "Master en Flask",
            autor: "Victor",
            url: "Victor.com"
    }]);
};

const crear = (req, res) => {
    // Recoger los parametros por post a guardar
    const parametros = req.body;

    // Validar datos
    validarArticulo(req.body);

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    // Asignar valores a objeto en el modelo (manual o automatico)
    // articulo.titulo = parametros.titulo;

    // Guardar el articulo en la base de datos

    try {
        articulo.save();

        // Devolver resultado
        return res.status(200).json({
            status: "Success",
            articulo: articulo,
            mensaje: "Articulo creado con exito!"
    });

    } catch(error) {
        res.status(500).json({
            "message": error
        });
    }
}

const listar = async (req, res) => {
    try {
        let consulta = await Articulo.find({});
        return res.status(200).json(consulta);
    } catch(error) {
        return res.status(404).send({
            status: new Error(error),
            message: "Error al realizar la busqueda de documentos en la coleccion"
        });
    }
};

const uno = async (req, res) => {
    // Recoger un ID por la URL
    let id = req.params.id;
    try {
        // Buscar el articulo
        let articulo = await Articulo.findById(id);
        // Si existe devolver resultado
        return res.status(200).json({
                    status: "Success",
                    articulo
        });

    } catch(error) {
        // Si no existe devolver error
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha encontrado el articulo"
        });
    }
};

const borrar = async (req, res) => {
    let id = req.params.id;
    try {
        let articuloBorrado = await Articulo.findOneAndDelete({_id:id});
        return res.status(200).json({
            status: "Success",
            mensajes: "Metodo de borrar",
            articuloBorrado
        })
    } catch(error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se encontró el articulo o no se pudo borrar."
        });
    }
}

const editar = async (req, res) => {
    let id = req.params.id;
    let datos = req.body;

    

    try {
        await validarArticulo(datos);
        var articulo = await Articulo.findOneAndUpdate({_id:id}, datos);
        return res.status(200).json({
            status: "Success",
            articulo: articulo
        });
    } catch (error) {
        return res.status(500).json({
            status: error,
            mensaje: "Error al actualizar"
        });
    };
};

const subir = async (req, res) => {
    // Configurar multer

    // Recoger el fichero de la imagen
    if(!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            mensaje: "Peticion invalida"
        });
    };

    // Nombre del archivo
    let archivo = req.file.originalname;

    // Extension del archivo
    let archivo_split = archivo.split(".");
    let extension = archivo_split[1];


    // Comprobar extension correcta
    if(extension != "png" && extension != "jpg" && 
    extension != "jpeg" && extension != "gif") {
        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        });
    } else {
        let id = req.params.id;
    
        try {
            await Articulo.findOneAndUpdate({_id:id}, {imagen: req.file.filename});
            return res.status(200).json({
                status: "Success",
                fichero: req.file
            });
        } catch (error) {
            return res.status(500).json({
                status: error,
                mensaje: "Error al actualizar"
            });
        };
    };
};

const imagen = (req, res) => {
    let filename = req.params.fichero;

    let ruta_fisica = path.join(__dirname, "../imagenes/articulos/", filename);

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: error,
                mensaje: "La imagen no existe"
            });
        };
    });
};

const buscador = async (req, res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR
    try {
        var articulosEncontrados = await Articulo.find({"$or": [
            {"titulo": {"$regex": busqueda, "$options": "i"}},
            {"contenido": {"$regex": busqueda, "$options": "i"}},
        ]})
        .sort({fecha: -1})

        if(!articulosEncontrados || articulosEncontrados.length <= 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            })}
    } catch(error) {
        return res.status(404).json({
            status: error,
            mensaje: "Hubo un error"
        })
    }

    return res.status(200).json({
        status: "Success",
        articulosEncontrados
    });

    // Ejecutar consulta

    // Devolver resultado
}



module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}