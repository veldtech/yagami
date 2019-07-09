import * as express from "express";
const app = express()
import * as bodyParser from "body-parser";

// move to .env files
//global.config = JSON.parse(fs.readFileSync("./config.json"));

//const authRouter = require("./routes/auth.router");
import imageRouter from "./routes/images.router";
import userRouter from "./routes/users.router";

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