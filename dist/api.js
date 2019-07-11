"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var images_router_1 = require("./routes/images.router");
var users_router_1 = require("./routes/users.router");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.send("<body><h1>yo, more miki api</h1></body>");
});
app.use(images_router_1["default"]);
app.use(users_router_1["default"]);
var port = process.env.PORT || 80;
app.listen(port);
