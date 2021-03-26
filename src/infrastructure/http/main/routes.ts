import { Application, Router } from "express";
import { readdirSync } from "fs";

export const setupRoutes = (app: Application): void => {
  try {
    const router = Router();
    app.use("/api", router);
    readdirSync(`${__dirname}/../routes`).map(async (file) => {
      if (file.includes(".test.")) return;
      (await import(`../routes/${file}`)).default(router, app)
    });
  } catch (error) {
    console.log(error, "err");
    throw error;
  }
};