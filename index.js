const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { model } = require("mongoose");
const ErrorObject = require("./utils/error");

app.use(express.json());

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.all("*", (req, res, next) => {
  const err = new ErrorObject(`http:localhost:6000${req.url} not found`, 404);
  next(err);
});

app.use(ErrorObject);

module.exports = app;
