import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import creditRouter from "./routes/credit";
import createRouter from "./routes/create";
import startWebsocketServer from "./websocketServer";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/credit", creditRouter);
app.use("/api/v1/create", createRouter);

const httpServer = app.listen(4000, async () => {
  console.log("Stating Server at: 4000");
});

startWebsocketServer(httpServer);
