const path = require("path");
const express = require("express");
const User = require('../model/user');
const mongoose = require('../config/connection');

const router = express.Router();

router.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'new_user.html'));
});

router.post('/', async (req, resp) => {
    let username = req.body?.username;
    if (username == undefined) {
        resp.send(`Field not provided username`);
        return;
    }

    let is_admin = false;
    if (req.body?.privilege == 'admin') {
        is_admin = true;
    }

    let user = new User({ username: username, is_admin: is_admin });
    await user.save();

    resp.send('Ok');
});

router.get('/list', async (req, resp) => {
    let users = await User.find({}, "username -_id");
    resp.send(users.map((user) => user.username));
});

module.exports = router;