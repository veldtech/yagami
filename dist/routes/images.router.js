"use strict";
exports.__esModule = true;
var express_1 = require("express");
var request = require("request");
var gm = require("gm");
function wordWrap(str, maxWidth) {
    var newLineStr = "\n";
    var done = false;
    var res = '';
    do {
        var found = false;
        for (var i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }
        if (str.length < maxWidth)
            done = true;
    } while (!done);
    return res + str;
}
function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
}
express_1.Router().get('/api/box', function (req, res) {
    try {
        var url = req.query.url;
        var text = req.query.text;
        var wrappedText = wordWrap(text, 15);
        var image = gm(request(url))
            .resize(190, 190, "!")
            .rotate("black", 28)
            .extent(600, 399)
            .roll(350, 100);
        image.draw(['image over 0,0 0,0 "./assets/box.png"']);
        image.font("./assets/fonts/Felt Regular.ttf", 24)
            .drawText(50, 275, wrappedText);
        image.toBuffer('PNG', function (err, buffer) {
            if (err)
                res.send(err.toString());
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });
    }
    catch (error) {
        res.send(JSON.stringify({ status: 500, message: error.toString() }));
    }
});
express_1.Router().get('/api/yugioh', function (req, res) {
    try {
        var url = req.query.url;
        var image = gm(request(url))
            .rotate('white', -10)
            .coalesce()
            .resize(280, 280, "!")
            .extent(480, 768, "-5+25");
        image.draw(['image over 0,0 0,0 "./assets/heartofthecard.png"']);
        image.toBuffer('PNG', function (err, buffer) {
            if (err)
                res.send(err.toString());
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });
    }
    catch (error) {
        res.send(JSON.stringify({ status: 500, message: error.toString() }));
    }
});
express_1.Router().get('/api/disability', function (req, res) {
    try {
        var url = req.query.url;
        var image = gm(request(url))
            .coalesce()
            .resize(100, 100, "!")
            .extent(467, 397, "-320-180");
        image.draw(['image over 0,0 0,0 "./assets/disability.png"']);
        image.toBuffer('PNG', function (err, buffer) {
            if (err)
                res.send(err.toString());
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });
    }
    catch (error) {
        res.send(JSON.stringify({ status: 500, message: error.toString() }));
    }
});
express_1.Router().get('/api/tohru', function (req, res) {
    try {
        var text = req.query.text;
        var wrappedText = wordWrap(text, 8);
        var image = gm(505, 560, "white");
        image.region(400, 400, 150, 100)
            .gravity('Center')
            .fontSize(48)
            .font("./assets/fonts/Little Days.ttf")
            .drawText(0, 0, wrappedText)
            .rotate("transparent", -5);
        image.region(505, 560).draw('image over 0,0 0,0 "./assets/tohru.png"');
        image.toBuffer('PNG', function (err, buffer) {
            if (err) {
                res.send(err.toString());
                console.log(err);
            }
            else {
                res.set('Content-Type', 'image/png');
                res.send(buffer);
            }
        });
    }
    catch (error) {
        res.send(JSON.stringify({ status: 500, message: error.toString() }));
    }
});
express_1.Router().get('/api/yagami', function (req, res) {
    try {
        var text = req.query.text;
        var wrappedText = wordWrap(text, 15);
        var image = gm("./assets/source-image.png");
        console.log(image);
        image.font("./assets/fonts/Felt Regular.ttf", 32)
            .drawText(10, 200, wrappedText);
        image.toBuffer('PNG', function (err, buffer) {
            if (err)
                res.send(err.toString());
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });
    }
    catch (error) {
        res.send(JSON.stringify({ status: 500, message: error.toString() }));
    }
});
exports["default"] = express_1.Router();
