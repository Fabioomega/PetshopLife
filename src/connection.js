const mongoose = require("mongoose");

mongoose
    .connect("mongodb://root:root@localhost:27017/petshop?authSource=admin", {})
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.error("Erro ao conectar:", err));

module.exports = mongoose;
