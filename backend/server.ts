import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { connectDB } from "./src/db/db.js";

const app = express()
await connectDB();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});