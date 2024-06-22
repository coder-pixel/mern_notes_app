const dotenv = require("dotenv");
const express = require("express");
const notes = require("./data/notes");
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");

dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json()); // read body data coming in json format  -- to accept json data

// routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const note = notes?.find((each) => each?._id === id);

  if (note) {
    res.json(note);
  } else {
    res.send("Not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
