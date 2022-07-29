const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userController = require("./controllers/userController.js");
const audioController = require("./controllers/audioController.js");
const effectController = require("./controllers/effectsController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/user", userController);
app.use("/audio", audioController);
app.use("/effects", effectController);

app.get("/", (req, res) => res.status(200).send("Welcome to Mixle backend!"));
app.get("*", (req, res) => res.status(404).send("Page not found"));

module.exports = app;
