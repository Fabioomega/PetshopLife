const express = require("express");
const User = require('./src/model/user');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/user_selection.html');
});

app.get('/users', (req, resp) => {
    resp.sendFile(__dirname + '/public/new_user.html');
});

app.post('/users', async (req, resp) => {
    let username = req.body?.username;
    if (username == undefined) {
        resp.send(`Field not provided username`);
        return; s
    }

    let is_admin = false;
    if (req.body?.privilege == 'admin') {
        is_admin = true;
    }

    let user = new User({ username: username, is_admin: is_admin });
    await user.save();

    resp.send('Ok');
});

app.listen(4000, function () {
    console.log("Servidor rodando..");
});
