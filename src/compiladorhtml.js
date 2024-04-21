const fs = require("fs/promises");
const handlebar = require("handlebars");

const compiladorhtml = async function (arquivo, contexto) {

    const html = await fs.readFile(arquivo);
    const compilador = handlebar.compile(html.toString())
    const htmlstring = compilador(contexto)
    return htmlstring
}

module.exports = compiladorhtml