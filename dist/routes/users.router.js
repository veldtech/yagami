"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var Pool = require('pg').Pool;
var gm = require("gm");
var express = require('express');
var Router;
() = express.Router();
var Canvas = require('canvas-constructor').Canvas;
var fs = require("await-fs");
var parseString = require('xml2js').parseString;
var axios = require('axios');
var pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: Number(process.env.port)
});
Canvas.registerFont("./assets/fonts/ARLRDBD.TTF", {
    family: "Arial",
    weight: "bold"
});
Canvas.registerFont("./assets/fonts/YuGothL.ttc", {
    family: "Roboto",
    weight: "light"
});
function CalculateLevel(exp) {
    var experience = exp;
    var Level = 0;
    var output = 0;
    while (experience >= output) {
        output = 10 + (output + (Level * 20));
        Level++;
    }
    return Level;
}
function CalculateExp(level) {
    var Level = 0;
    var output = 0;
    do {
        output = 10 + (output + (Level * 20));
        Level++;
    } while (Level < level);
    return output;
}
Router().get('/api/custom', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var xml;
    return __generator(this, function (_a) {
        xml = fs.readFileSync("./test.xml", "utf8");
        console.log(xml);
        parseString(xml, function (err, result) {
            if (err)
                console.log(err);
            var avatarUrl = "https://cdn.miki.ai/avatars/121919449996460033.png";
            loadPNG(avatarUrl, function (avatar) {
                var canvas = new Canvas(512, 256, "png")
                    .setTextFont("48px Arial")
                    .addText("Hello World", 128, 64)
                    .addImage(avatar, 30, 30, 64, 64);
                res.set('Content-Type', 'image/png');
                res.send(canvas.toBuffer());
            });
        });
        return [2];
    });
}); });
Router().get('/api/ship', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var me, other, value, avatarUrl, avatarUrlOther, avatarMe, avatarOther, heart, size, fontSize, canvas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time('ship');
                me = req.query.me;
                other = req.query.other;
                value = req.query.value;
                avatarUrl = "https://cdn.miki.ai/avatars/" + me + ".png";
                avatarUrlOther = "https://cdn.miki.ai/avatars/" + other + ".png";
                return [4, axios.get(avatarUrl, {
                        headers: {
                            "cache": "no-cache"
                        },
                        responseType: 'arraybuffer'
                    })];
            case 1:
                avatarMe = _a.sent();
                avatarOther = avatarMe;
                if (!(avatarUrlOther != avatarUrl)) return [3, 3];
                return [4, axios.get(avatarUrlOther, {
                        headers: {
                            "cache": "no-cache"
                        },
                        responseType: 'arraybuffer'
                    })];
            case 2:
                avatarOther = _a.sent();
                _a.label = 3;
            case 3: return [4, fs.readFile("assets/heart.png")];
            case 4:
                heart = _a.sent();
                size = 50 + Math.max(0, Math.min(value, 200));
                fontSize = Math.round(size / 100 * 32);
                canvas = new Canvas(512, 256, "png")
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
                return [2];
        }
    });
}); });
Router().get('/api/user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var id, r, user, url, avatarUrl, frontColor, backColor, level, expNextLevel, background, avatar, canvas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time('user');
                id = req.query.id;
                return [4, pool.query("select v.\"BackgroundColor\" as backcolor, \n        v.\"ForegroundColor\" as forecolor, \n        v.\"BackgroundId\" as background, \n        u.\"Total_Experience\" as experience, \n        u.\"Name\" as name, \n        (select \"Rank\" from dbo.\"mview_glob_rank_exp\" where \"Id\" = $1) as rank \n        from dbo.\"Users\" as u left join dbo.\"ProfileVisuals\" v on u.\"Id\" = v.\"UserId\" where u.\"Id\" = $1;", [id])];
            case 1:
                r = _a.sent();
                if (!(r != null)) return [3, 4];
                user = r.rows[0];
                url = "https://cdn.miki.ai/image-profiles/backgrounds/background-" + (user.background || 0) + ".png";
                avatarUrl = "https://cdn.miki.ai/avatars/" + id + ".png";
                frontColor = user.forecolor || "#000000";
                backColor = user.backcolor || "#000000";
                if (!frontColor.startsWith("#")) {
                    frontColor = "#" + frontColor;
                }
                if (!backColor.startsWith("#")) {
                    backColor = "#" + backColor;
                }
                level = CalculateLevel(user.experience);
                expNextLevel = CalculateExp(level + 1);
                return [4, axios.get(url, {
                        responseType: 'arraybuffer'
                    })];
            case 2:
                background = _a.sent();
                return [4, axios.get(avatarUrl, {
                        responseType: 'arraybuffer'
                    })];
            case 3:
                avatar = _a.sent();
                canvas = new Canvas(512, 256, "png")
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
                    .addRoundImage(avatar.data, 10, 10, 100, 100, 50);
                res.set('Content-Type', 'image/png');
                res.end(canvas.toBuffer());
                console.timeEnd('user');
                return [2];
            case 4:
                res.end(JSON.stringify({
                    error: "User not found!"
                }));
                console.timeEnd('user');
                _a.label = 5;
            case 5: return [2];
        }
    });
}); });
exports["default"] = Router();
