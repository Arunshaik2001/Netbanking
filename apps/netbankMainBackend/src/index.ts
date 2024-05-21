import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import creditRouter from "./routes/credit";
import createRouter from "./routes/create";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { WebsocketTransactionPayload } from "@repo/types/customTypes";

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

const clients: { [key: string]: WebSocket } = {};

const wss = new WebSocketServer({ server: httpServer });

const rawDataToJson = (data: RawData) => {
  if (Buffer.isBuffer(data)) {
    // If data is Buffer
    return JSON.parse(data.toString("utf-8"));
  } else if (data instanceof ArrayBuffer) {
    // If data is ArrayBuffer
    const buffer = Buffer.from(data);
    return JSON.parse(buffer.toString("utf-8"));
  } else if (
    Array.isArray(data) &&
    data.every((item) => Buffer.isBuffer(item))
  ) {
    // If data is an array of Buffers
    const combinedBuffer = Buffer.concat(data);
    return JSON.parse(combinedBuffer.toString("utf-8"));
  } else {
    throw new Error("Unsupported data type");
  }
};

wss.on("connection", function connection(ws) {
  let clientId: string;

  ws.on("error", console.error);

  ws.on("message", function message(dataJson, isBinary) {
    const data: WebsocketTransactionPayload = rawDataToJson(dataJson);

    console.log("--------------------");
    console.log(data);

    if (data.type === "identifier") {
      clientId = String(data.content.data.clientId);
      clients[clientId] = ws;
    } else if (data.type === "message") {
      const clientIdToSend = String(data.content.data.clientIdToSend);
      if (
        clients[clientIdToSend] &&
        clients[clientIdToSend]!.readyState == WebSocket.OPEN
      ) {
        clients[clientIdToSend]!.send(
          JSON.stringify({
            paymntToken: data.content.data.paymntToken,
            status: data.content.data.status,
          }),
          { binary: false }
        );
      }
    }
  });

  ws.on("close", () => {
    if (clientId) {
      delete clients[clientId];
      console.log(`Client disconnected with ID: ${clientId}`);
    }
  });
});
