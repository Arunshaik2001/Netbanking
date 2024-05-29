import { RawData } from "ws";

export function generateRandom7DigitNumber() {
  const min = 1000000;
  const max = 9999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const rawDataToJson = (data: RawData) => {
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
