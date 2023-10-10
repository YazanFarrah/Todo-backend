const express = require("express");
const app = express();
const mongoose = require("mongoose");

const todoRouter = require("./routes/todo");
require("dotenv").config();

app.use(todoRouter);
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => console.log(e));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
