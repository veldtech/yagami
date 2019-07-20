import * as express from "express";
const app = express()
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config({
	path: "../.env",
	encoding: "utf8"
})

import imageRouter from "./routes/images.router";
import userRouter from "./routes/users.router";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) =>
{
	res.send("<body><h1>yo, more miki api</h1></body>");
});

app.use(imageRouter);
app.use(userRouter);

app.listen(process.env.API_PORT);