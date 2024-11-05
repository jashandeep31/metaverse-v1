import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/v1";
import { PrismaClient } from "@repo/db";
import cors from "cors";

dotenv.config();
//  Just a sample code to
const client = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

cors({
  origin: "*",
});

app.use(cors());

app.use("/api/v1", router);

const databaseConnection = () => {
  client
    .$connect()
    .then(() => {
      console.log("connected to database");
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error: any) => {
      console.log("error connecting to database", error);
    });
};

databaseConnection();
