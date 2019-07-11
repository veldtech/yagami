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
exports.__esModule = true;
var express_1 = require("express");
var gm = require("gm");
var axios_1 = require("axios");
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
    return __awaiter(this, void 0, void 0, function () {
        var url, text, wrappedText, response, image, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = req.query.url;
                    text = req.query.text;
                    wrappedText = wordWrap(text, 15);
                    return [4, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    image = gm(response.data)
                        .resize(190, 190, "!")
                        .rotate("black", 28)
                        .extent(600, 399)
                        .roll(350, 100);
                    image.draw('image over 0,0 0,0 "./assets/box.png"');
                    image.font("./assets/fonts/Felt Regular.ttf", 24)
                        .drawText(50, 275, wrappedText);
                    image.toBuffer('PNG', function (err, buffer) {
                        if (err)
                            res.send(err.toString());
                        res.set('Content-Type', 'image/png');
                        res.send(buffer);
                    });
                    return [3, 3];
                case 2:
                    error_1 = _a.sent();
                    res.send(JSON.stringify({ status: 500, message: error_1.toString() }));
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
});
express_1.Router().get('/api/yugioh', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, image, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = req.query.url;
                    return [4, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    image = gm(response.data)
                        .rotate('white', -10)
                        .coalesce()
                        .resize(280, 280, "!")
                        .extent(480, 768, "-5+25");
                    image.draw('image over 0,0 0,0 "./assets/heartofthecard.png"');
                    image.toBuffer('PNG', function (err, buffer) {
                        if (err)
                            res.send(err.toString());
                        res.set('Content-Type', 'image/png');
                        res.send(buffer);
                    });
                    return [3, 3];
                case 2:
                    error_2 = _a.sent();
                    res.send(JSON.stringify({ status: 500, message: error_2.toString() }));
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
});
express_1.Router().get('/api/disability', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, image, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = req.query.url;
                    return [4, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    image = gm(response.data)
                        .coalesce()
                        .resize(100, 100, "!")
                        .extent(467, 397, "-320-180");
                    image.draw('image over 0,0 0,0 "./assets/disability.png"');
                    image.toBuffer('PNG', function (err, buffer) {
                        if (err)
                            res.send(err.toString());
                        res.set('Content-Type', 'image/png');
                        res.send(buffer);
                    });
                    return [3, 3];
                case 2:
                    error_3 = _a.sent();
                    res.send(JSON.stringify({ status: 500, message: error_3.toString() }));
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
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
