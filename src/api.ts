import express from "express";
const app = express()
import * as bodyParser from "body-parser";
import * as imageRouter from "./routes/images.router";
import * as userRouter from "./routes/users.router";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("<body><h1>yo, more miki api</h1></body>");
});

app.get("/api/custom", userRouter.custom)
app.get("/api/ship", userRouter.ship)
app.get("/api/user", userRouter.user)

app.get("/api/box", imageRouter.box)
app.get("/api/yugioh", imageRouter.yugioh)
app.get("/api/disability", imageRouter.disability)
app.get("/api/tohru", imageRouter.tohru)
app.get("/api/yagami", imageRouter.yagami)

app.listen(8001);