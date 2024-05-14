import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import creditRouter from "./routes/credit";
import createRouter from "./routes/create";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/credit", creditRouter);
app.use("/api/v1/create", createRouter);

app.listen(4000, () => {
  console.log("Stating Server at: 4000");
});
