import { createClient } from "redis";
import processTransaction from "./txProccessor";
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + "/../../.env" })

async function main() {
  console.log("Starting Transaction Handler");
  const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhoscdt:6379",
  });
  try {
    await redisClient.connect();
    while (true) {
      const txItem = await redisClient.rPop("ON_RAMP_TRANSACTIONS_QUEUE");
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
