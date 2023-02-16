import express from "express";
import { MongoClient, ObjectId } from "mongodb";

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

// Create a room
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

app.delete("/delete_broom/:id", async (req, res) => {
  let { id } = req.params;
  const deleteRoom = await client
    .db("hallBooking")
    .collection("book_room")
    .deleteOne({ _id: ObjectId(id) });

  res.status(404).send("No such movie found");
});

// Booking a room
app.post("/book_room", async (req, res) => {
  const data = req.body;
  const roomId = data.roomID;
  const startTime = data.startTime.split(":")[0];

  // Fetching all booked rooms data to check if required room is available or not
  const allRooms = await client
    .db("hallBooking")
    .collection("book_room")
    .find({})
    .toArray();

  const requiredRoom = allRooms
    .filter((room) => room.roomID === roomId)
    .map((room) => {
      let bookingStartTime = room.startTime.split(":")[0];
      if (startTime >= bookingStartTime) {
        return true;
      } else {
        return false;
      }
    });

  if (requiredRoom[0] === true) {
    res.status(404).json({
      status: "fail",
      message: "The room is already booked for the given time slot!",
    });
  } else {
    const roomBooked = await client
      .db("hallBooking")
      .collection("book_room")
      .insertOne(data);

    res.status(200).json({
      status: "success",
      roomBooked,
    });
  }
});

app.get("/allRooms", async (req, res) => {});

app.listen(PORT, () => console.log(`The server started in port ${PORT} ✨✨`));

export { client };
