const { Pool }  = require('pg');
const gm        = require("gm");
const express   = require('express');
const request	= require('request');
const router    = express.Router();
const { Canvas } = require('canvas-constructor');
const https = require("https");

const pool = new Pool({
    user: global.config.user,
    host: global.config.host,
    database: global.config.database,
    password: global.config.password,
    port: global.config.port,
});

Canvas.registerFont("./assets/fonts/ARLRDBD.TTF", {
    family: "Arial",
    weight: "bold"
});

Canvas.registerFont("./assets/fonts/YuGothL.ttc", {
    family: "Roboto",
    weight: "light"
});

// Easy loads a png.
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

// Calculates Miki level from experience
function CalculateLevel(exp)
{
    var experience = exp;
    var Level = 0;
    var output = 0;
    while (experience >= output)
    {
        output = 10 + (output + (Level * 20));
        Level++;
    }
    return Level;
}

// Calculates Miki experience from level
function CalculateExp(level)
{
    var Level = 0;
    var output = 0;
    do
    {
        output = 10 + (output + (Level * 20));
        Level++;
    } while (Level < level);
    return output;
}

router.get('/api/user', function(req, res)
{
    var id = req.query.id;     
        
    var url = "https://miki-cdn.nyc3.digitaloceanspaces.com/image-profiles/backgrounds/background-0.png";
    var avatarUrl = "https://miki-cdn.nyc3.digitaloceanspaces.com/avatars/" + id + ".png";

    var frontColor = "#000000";
    var backColor = "#000000";
    
    pool.query("select \"Total_Experience\" as experience, \"Name\" as name, (select count(*) + 1 from dbo.\"Users\" where \"Total_Experience\" > u.\"Total_Experience\") as rank from dbo.\"Users\" as u where \"Id\" = $1", [id], (err, r) =>
    {
        if(r != null)
        {
            var user = r.rows[0];

            var level = CalculateLevel(user.experience);
            var expNextLevel = CalculateExp(level + 1);

            loadPNG(url, (background) => 
            {
                loadPNG(avatarUrl, (avatar) => 
                {    
                    var canvas = new Canvas(512, 256, "png")
                        .addImage(background, 0, 0, 512, 256)
                        .setColor(backColor + "20")
                        .addRect(0, 124, 512, 50)
                        .addRect(15, 216, 512 - 30, 25)
                        .setColor(frontColor + "60")
                        .addRect(18, 219, user.experience / expNextLevel * 476, 19)
                        .setTextFont("48px Arial")
                        .setColor(frontColor + "FF")
                        .addText(user.name, 15, 166, 512)
                        .setTextAlign("left")
                        .setTextFont("32px Arial")
                        .addText("LV", 15, 216)
                        .setTextFont("42px Roboto")
                        .addText(level, 60, 216)
                        .setTextAlign("right")
                        .setTextFont("32px Arial")
                        .addText("#", 512 - 15, 216)
                        .setTextFont("42px Roboto")
                        .addText(user.rank, 512 - 35, 216)
                        .setTextFont("20px Roboto")
                        .setTextAlign("center")
                        .addText(user.experience + "/" + expNextLevel, 256, 236)
                        .addRoundImage(avatar, 10, 10, 100, 100, 50)
                        
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