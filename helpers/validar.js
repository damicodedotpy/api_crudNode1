const validator = require("validator");

const validarArticulo = (parametros) => {
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                                validator.isLength(parametros.titulo, {min: 0, max: 15});


        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No se ha validado la informacion!!")
        }
    } catch(error) {
        throw new Error(error);
        // return res.status(400).json({
        //     status: error,
        //     mensaje: "Faltan datos por enviar"
        // })
    }
}

module.exports = {
    validarArticulo
}