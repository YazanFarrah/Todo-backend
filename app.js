const express = require("express");

const app = express();

const mongoose = require("mongoose");

require("dotenv").config();
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => console.log(e));

app.listen(3000);
