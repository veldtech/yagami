const { Pool }  = require('pg');
const gm        = require("gm");
const express   = require('express');
const request	= require('request');
const router    = express.Router();
const {createCanvas, loadImage, Image} = require('canvas');

const pool = new Pool({
    user: global.config.user,
    host: global.config.host,
    database: global.config.database,
    password: global.config.password,
    port: global.config.port,
});

router.get('/api/user', function(req, res)
{
    var id = req.query.id;       
    var url = "https://miki-cdn.nyc3.digitaloceanspaces.com/image-profiles/backgrounds/background-0.png";
    var avatarUrl = "https://miki-cdn.nyc3.digitaloceanspaces.com/image-profiles/avatars/" + id + ".png";

/*    pool.query("SELECT * from dbo.\"Users\" where \"Id\" = $1", [id], (err, r) =>
    {
        if(r != null)
        {
            var user = r.rows[0];*/
            var avatar = request(avatarUrl);

            const canvas = createCanvas(512, 256)
            const ctx = canvas.getContext('2d')

            var background = new Image();
 

            request.get(url, (err, response, body) => {
                if(err) console.log(err);
                background.onload = () => {
                    ctx.drawImage(background, 0, 0, 512, 256);
                    res.set('Content-Type', 'image/png');
                    canvas.createPNGStream().pipe(res);
                }
                background.src = body;
            });
    /*    }
        else
        { 
            res.send(JSON.stringify({
                error: "User not found!"
            }));
            return;
        }
    });*/
});

module.exports = router;