import fs from "fs";
const logPath = "./logs/access.log";

export const fileLogger = {
  write: (entry: any) => {
    fs.appendFileSync(logPath, JSON.stringify(entry) + "\n");
  }
};