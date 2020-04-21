import * as Sentry from "@sentry/node";
import express from "express";
const app = express();
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { RuntimeError } from "./runtime-error";
dotenv.config();

import * as imageRouter from "./routes/images.router";
import * as userRouter from "./routes/users.router";

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(
  Sentry.Handlers.requestHandler({
    request: ["headers", "method", "query_string", "url"],
    transaction: "methodPath",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO: remove once migration has completed.
app.get("/api/ship", userRouter.ship);
app.get("/api/user", userRouter.user);
app.get("/api/box", imageRouter.box);
app.get("/api/yugioh", imageRouter.yugioh);
app.get("/api/disability", imageRouter.disability);
app.get("/api/tohru", imageRouter.tohru);
app.get("/api/yagami", imageRouter.yagami);

app.get("/ship", userRouter.ship);
app.get("/user", userRouter.user);
app.get("/box", imageRouter.box);
app.get("/yugioh", imageRouter.yugioh);
app.get("/disability", imageRouter.disability);
app.get("/tohru", imageRouter.tohru);
app.get("/yagami", imageRouter.yagami);

app.use(Sentry.Handlers.errorHandler());

app.use((err: RuntimeError, req, res, next) => {
  res.statusCode = err.getStatusCode();
  res.send({
    error: err.getPublicMessage(),
    request_id: res.sentry,
  });
});

app.listen(process.env.API_PORT, () =>
  console.log(`Running on port: ${process.env.API_PORT}`)
);
