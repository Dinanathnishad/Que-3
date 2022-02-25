require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
require("./db/conn");
const userRouter = require("./routes/users");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const app = express();

app.use(express.json());
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
