import { WebsocketTransactionPayload } from "@repo/types/customTypes";
import { rawDataToJson } from "@repo/utils/utils";
import { Server, WebSocketServer, WebSocket } from "ws";

export default function startWebsocketServer(httpServer: any) {
  const clients: { [key: string]: WebSocket } = {};

  const wss = new WebSocketServer({ server: httpServer });

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
}
