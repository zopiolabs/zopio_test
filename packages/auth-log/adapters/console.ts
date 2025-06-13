export const consoleLogger = {
  write: (entry: any) => {
    console.log("[AUTH-LOG]", JSON.stringify(entry, null, 2));
  }
};