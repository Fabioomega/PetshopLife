const path = require("path");
const express = require("express");
const User = require('../model/user');

const router = express.Router();

router.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, '..', '..', 'public', 'new_user.html'));
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

module.exports = router;