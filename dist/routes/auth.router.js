"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var express_1 = require("express");
var pool = new pg_1.Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: Number(process.env.port)
});
function getUser(key, callback) {
    pool.query("SELECT * from users where api_key = $1", [key], function (err, r) {
        if (r != null) {
            callback(r.rows[0]);
        }
    });
}
function authorize(req, res, next) {
    if (req.query.key != null) {
        getUser(req.query.key, function (r) {
            if (r != null) {
                if (req.query.key == r.api_key) {
                    next();
                    return;
                }
            }
            else {
                res.send(JSON.stringify({
                    status: 403,
                    message: "Invalid API Key"
                }));
                return;
            }
        });
    }
    else {
        res.send(JSON.stringify({
            status: 401,
            message: "Unauthorized"
        }));
    }
}
express_1.Router().use(authorize);
exports["default"] = express_1.Router();
