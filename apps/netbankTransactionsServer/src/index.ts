import { createClient } from "redis";
import processTransaction from "./txProccessor";



async function main() {
  console.log("Starting Transaction Handler");
  const redisClient = createClient({
    url: "redis://localhost:6379",
  });
  try {
    await redisClient.connect();
    while (true) {
      const txItem = await redisClient.rPop("OFF_RAMP_TRANSACTIONS_QUEUE");

      if (txItem) {
        processTransaction(txItem);
      }
    }
  } catch (error) {
    console.log(error);
    await redisClient.quit();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
