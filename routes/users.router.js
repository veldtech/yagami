const { Pool }  = require('pg');
const gm        = require("gm");
const express   = require('express');
const router    = express.Router();
const { Canvas } = require('canvas-constructor');
const fs = require("await-fs");
const parseString = require('xml2js').parseString;
const axios = require('axios');

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

router.get('/api/custom', async (req, res) => {
    var xml = fs.readFileSync("./test.xml", "utf8");
    console.log(xml);
    parseString(xml, function (err, result) {
        if(err) console.log(err);

        var avatarUrl = "https://miki-cdn.nyc3.digitaloceanspaces.com/avatars/121919449996460033.png"

        loadPNG(avatarUrl, (avatar) => 
        {    
            var canvas = new Canvas(512, 256, "png")
                .setTextFont("48px Arial")
                .addText("Hello World", 128, 64)
                .addImage(avatar, 30, 30, 64, 64)
                
            res.set('Content-Type', 'image/png');
            res.send(canvas.toBuffer());
        });
    });
});

router.get('/api/ship', async (req, res) => {
    console.time('ship');

    var me = req.query.me;
    var other = req.query.other;
    var value = req.query.value;

    var avatarUrl = "https://miki-cdn.nyc3.cdn.digitaloceanspaces.com/avatars/" + me + ".png";    
    var avatarUrlOther = "https://miki-cdn.nyc3.cdn.digitaloceanspaces.com/avatars/" + other + ".png";    

    var avatarMe = await axios.get(avatarUrl, {
        responseType: 'arraybuffer'
      });

    if(avatarUrlOther != avatarUrl)
    {
        avatarOther = await axios.get(avatarUrlOther, {
            responseType: 'arraybuffer'
          });
    }
    else
    {
        var avatarOther = avatarMe;
    }

    var heart = await fs.readFile("assets/heart.png");

    var size = 50 + Math.max(0, Math.min(value, 200));
    var fontSize = Math.round(size / 100 * 32);

    var canvas = new Canvas(512, 256, "png")
        .addImage(avatarMe.data, 28, 28, 200, 200)
        .addImage(avatarOther.data, 284, 28, 200, 200)
        .addImage(heart, 256 - Math.round(size / 2), 128 - Math.round(size / 2), size, size)
        .setTextFont(fontSize + "px Arial")
        .setColor("#FFFFFF")
        .setTextAlign("center")
        .addText(value + "%", 256, 128 + 10)
        .setAntialiasing("subpixel");

    res.set('Content-Type', 'image/png');
    res.send(canvas.toBuffer());
    console.timeEnd('ship');
});

router.get('/api/user', async (req, res) =>
{
    console.time('user');
    var id = req.query.id;     
    
    var r = await pool.query(
        `select v."BackgroundColor" as backcolor, 
        v."ForegroundColor" as forecolor, 
        v."BackgroundId" as background, 
        u."Total_Experience" as experience, 
        u."Name" as name, 
        (select count_estimate('select 1 from dbo."Users" where "Total_Experience" >= ' || u."Total_Experience") + 1) as rank 
        from dbo."Users" as u left join dbo."ProfileVisuals" v on u."Id" = v."UserId" where u."Id" = $1;`, [id])
    if(r != null)
    {
        var user = r.rows[0];

        var url = "https://miki-cdn.nyc3.cdn.digitaloceanspaces.com/image-profiles/backgrounds/background-" + (user.background || 0) + ".png";
        var avatarUrl = "https://miki-cdn.nyc3.cdn.digitaloceanspaces.com/avatars/" + id + ".png";    
        var frontColor = user.forecolor || "#000000";
        var backColor = user.backcolor || "#000000";

        if(!frontColor.startsWith("#"))
        {
            frontColor = "#" + frontColor;
        }
    
        if(!backColor.startsWith("#"))
        {
            backColor = "#" + backColor;
        }

        var level = CalculateLevel(user.experience);
        var expNextLevel = CalculateExp(level + 1);

        var background = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        var avatar = await axios.get(avatarUrl, {
            responseType: 'arraybuffer'
        });

        var canvas = new Canvas(512, 256, "png")
            .addImage(background.data, 0, 0, 512, 256)
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
            .addRoundImage(avatar.data, 10, 10, 100, 100, 50)
            
        res.set('Content-Type', 'image/png');
        res.end(canvas.toBuffer());
        console.timeEnd('user');
        return;
    }
    else
    {
        res.end(JSON.stringify({
            error: "User not found!"
        }));
        console.timeEnd('user');
    }
});

module.exports = router;