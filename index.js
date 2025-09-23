const path = require("path");
const express = require("express");

const app = express();

const usersRouter = require('./src/routes/users.routes');
app.use("/users", usersRouter);

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));


// rota inicial
app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/user_selection.html');
});


app.listen(8000, function () {
    console.log("Servidor rodando na porta 8000...");
});
