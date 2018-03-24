const express		= require('express');
const app			= express();
const bodyParser	= require('body-parser');
const fs			= require("fs");

global.config = JSON.parse(fs.readFileSync("./config.json"));

//const authRouter = require("./routes/auth.router");
const imageRouter = require("./routes/images.router");
const userRouter = require("./routes/users.router");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
{
	res.sendFile("docs.html", {root : __dirname});
});

//app.use("/api/*", authRouter);
app.use(imageRouter);
app.use(userRouter);

var port = process.env.PORT || 80;

app.listen(port);