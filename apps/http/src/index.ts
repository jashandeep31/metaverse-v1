import express from "express";
import dotenv from "dotenv";
dotenv.config();

//  Just a sample code to
// import { PrismaClient } from "@repo/db";
// const client = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
