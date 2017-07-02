// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const gm         = require("gm");
const image      = gm("./assets/source-image.png");
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT;        // set our port


function wordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
    do {
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
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
};

// ROUTES FOR OUR API
// =============================================================================

app.get('/', function (req, res) {
  res.set('Content-Type', 'image/png');

  var text = req.query.text;
  var wrappedText = wordWrap(text, 15);

  gm("./assets/source-image.png")
    .font("Felt Regular.ttf", 32)
    .drawText(10, 200, wrappedText)
    .toBuffer(function (err, buffer)
    {
      res.end(buffer, 'binary');
    });
  });

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("listening on " + port);
