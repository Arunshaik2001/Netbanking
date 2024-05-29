import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import creditRouter from "./routes/credit";
import createRouter from "./routes/create";
import startWebsocketServer from "./websocketServer";
import http from 'http';
import https from 'https';
import fs from 'fs'


dotenv.config({ path: __dirname + "/../../.env" })


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://netbanking.dev-boi.com", "https://paymnt.dev-boi.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/credit", creditRouter);
app.use("/api/v1/create", createRouter);



let server: http.Server | https.Server;

try {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/netbankingbe.dev-boi.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/netbankingbe.dev-boi.com/fullchain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
  };

  server = https.createServer(credentials, app);
  console.log('HTTPS server created');
} catch (error) {
  console.error('Failed to read SSL certificates, falling back to HTTP:', error);
  server = http.createServer(app);
  console.log('HTTP server created');
}

startWebsocketServer(server);


server.listen(4000, async () => {
  console.log("Stating Server at: 4000");
});

