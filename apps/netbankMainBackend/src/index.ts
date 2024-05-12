import express from "express";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.listen(4000, () => {
  console.log("Stating Server at: 4000");
});
