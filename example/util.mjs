import { memoryUsage } from "node:process";

const toMB = (bytes) => Math.round(((bytes / 1024 / 1024) * 100) / 100);

export const mem = () => {
  const { heapTotal, heapUsed } = memoryUsage();
  return {
    heapTotal: `${toMB(heapTotal)} MB`,
    heapUsed: `${toMB(heapUsed)} MB`,
  };
};
