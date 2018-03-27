const { Pool }  = require('pg');
const gm        = require("gm");
const express   = require('express');
const request	= require('request');
const router    = express.Router();
const {createCanvas, loadImage, Image} = require('canvas');
const { Canvas } = require('canvas-constructor');
const https = require("https");

const pool = new Pool({
    user: global.config.user,
    host: global.config.host,
    database: global.config.database,
    password: global.config.password,
    port: global.config.port,
});

function loadPNG(url, callback)
{
    https.get(url, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            callback(body);
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}

router.get('/api/user', function(req, res)
{
    var id = req.query.id;     
        
    var url = "https://miki-cdn.nyc3.digitaloceanspaces.com/image-profiles/backgrounds/background-0.png";
    var avatarUrl = "https://miki-cdn.nyc3.digitaloceanspaces.com/avatars/" + id + ".png";

    pool.query("SELECT * from dbo.\"Users\" where \"Id\" = $1", [id], (err, r) =>
    {
        if(r != null)
        {
            var user = r.rows[0];

            loadPNG(url, (background) => 
            {
                loadPNG(avatarUrl, (avatar) => 
                {    
                    var canvas = new Canvas(512, 256, "png")
                        .addImage(background, 0, 0, 512, 256)
                        .addImage(avatar, 25, 25, 100, 100, { radius: 45, type: "round", restore: true });

                    var buffer = canvas.toBuffer().toString('base64');

                    res.set('Content-Type', 'image/png');
                    res.send(canvas.toBuffer());
                });
            });
        }
        else
        { 
            res.send(JSON.stringify({
                error: "User not found!"
            }));
            return;
        }
    });
});

module.exports = router;