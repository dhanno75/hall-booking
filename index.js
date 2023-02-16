import express from "express";
import { MongoClient } from "mongodb";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

await client.connect();
console.log("MongoDB is connected!!!");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Welcome to Hall Booking!!!");
});

app.post("/create_room", async (req, res) => {
  const data = req.body;
  const room = await client
    .db("hallBooking")
    .collection("room")
    .insertOne(data);

  res.status(200).json({
    message: "success",
    room,
  });
});

app.post("/book_room", async (req, res) => {
  const data = req.body;
  const room = await client
    .db("hallBooking")
    .collection("book_room")
    .insertOne(data);

  res.status(200).json({
    message: "success",
    room,
  });
});

app.listen(PORT, () => console.log(`The server started in port ${PORT} ✨✨`));

export { client };
