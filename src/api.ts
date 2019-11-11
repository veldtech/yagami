import express from "express";
const app = express()
import * as bodyParser from "body-parser";
import * as imageRouter from "./routes/images.router";
import * as userRouter from "./routes/users.router";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get("/api/custom", userRouter.custom)
app.get("/ship", userRouter.ship);
app.get("/shipd", userRouter.shipdirect)
app.get("/user", userRouter.user)

app.get("/box", imageRouter.box)
app.get("/yugioh", imageRouter.yugioh)
app.get("/disability", imageRouter.disability)
app.get("/tohru", imageRouter.tohru)
app.get("/yagami", imageRouter.yagami)

app.listen(process.env.API_PORT);
