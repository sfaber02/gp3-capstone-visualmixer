const express = require("express");
const cors = require("cors");

const userController = require("./controllers/userController.js");
const audioController = require("./controllers/audioController.js");
const effectController = require("./controllers/effectsController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userController);
app.use("/audio", audioController);
app.use("/effects", effectController);

app.get("/", (req, res) => res.status(200).send("Welcome to Mixle backend!"));

// app.get("/verify/:uniqueString", async (req, res) => {
//     // getting the string
//     const { uniqueString } = req.params;
//     // check is there is anyone with this string
//     const user = await getUser.findOne({ uniqueString: uniqueString });
//     if(user){
//         // if there is anyone, mark them verified
//         user.isValid = true;
//         await user.save();
//         // redirect to the home or anywhere else
//         res.redirect("/");
//     }else{
//         // else send an error message
//         res.status(404).send("User not found");
//     }
// })

app.get("*", (req, res) => res.status(404).send("Page not found"));


module.exports = app;
