const path = require("path");
const express = require("express");

const app = express();

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./src/routes/users.routes');
const slotsRouter = require('./src/routes/slots.routes');

app.use("/users", usersRouter);
app.use("/slots", slotsRouter);

// rota inicial
app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/user_selection.html');
});


app.listen(8080, function () {
    console.log("Servidor rodando na porta 8080...");
});
