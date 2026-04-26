import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./src/db/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";

declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    userId: string;
  }
}

const app = express();
await connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      collectionName: "session",
    }),
  }),
);
app.use(express.json());

const port = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
