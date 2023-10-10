require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const todoRouter = require("./routes/todo");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use("/home", todoRouter);

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => console.log(e));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
