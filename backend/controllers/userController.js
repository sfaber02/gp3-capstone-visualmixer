// DEPENDENCIES
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { sendConfirmationEmail } = require("../services/EmailService.js");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
// const sgMail = require("@sendgrid/mail");

const {
    doesUserExist,
    addUser,
    deleteUser,
    getUser,
    updateUser,
    getUserById,
    updateUserVotes,
} = require("../queries/users.js");

// CONFIGURATION
const user = express.Router();

// REGISTER CREATE REQUEST
user.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (await doesUserExist(email)) {
            res.status(400).json({
                error: "User with that email already exists",
            });
            return;
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        
        try {
            const newUser = await addUser(username, email, hashPassword);
        
            const sendConfirmationEmail = async (newUser) => {

                let transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: "apikey",
                        pass: process.env.SENDGRID_API_KEY
                    }
                 })

                 const token = await jwt.sign(
                    { id: newUser.user_id },
                    process.env.SECRET_KEY
                );

                let sender = "hectorilarraza1414@gmail.com";
                const url = `http://localhost:3000/verify/${token}`;
                 transporter.sendMail({
                     to: `${newUser.username} <${newUser.email}>`, // recipient email
                     from: `Mixle Support <${sender}>`, // verified sender email
                     subject: "Email Confirmation", // Subject line
                     html: `Press <a href=${url}> here </a> to verify your email. Thanks`, // html body
                   }, function(error, info){
                     if (error) {
                       console.log(error);
                     } else {
                       console.log('Email sent: ' + info.response);
                     }
                   });

            }

            console.log(sendConfirmationEmail(newUser)); 
            
            res.status(200).json({ userInfo: newUser, token: token });
    
        } catch (err) {
            res.status(500).send(err, "Failed User creation");
        }

    } catch (err) {
        res.status(404).send("Post failed");
    }
}); 

//GET USER INFO
user.get("/:id", async (req, res) => {
    const id = req.params;
    try {
        const user = await getUserById(id.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            error: err,
        });
    }
});

// LOGIN CREATE REQUEST
user.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUser(email);
        if (!user.email) {
            res.status(400).json({
                error: "email",
                errorMsg: "Incorrect email, please try again.",
            });
        } else {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (isValidPassword) {
                const token = jwt.sign({ email }, process.env.SECRET_KEY);

                res.status(200).json({
                    message: `${user.username} signed in!`,
                    username: user.username,
                    user_id: user.user_id,
                    token: token,
                });
            } else {
                res.status(400).json({
                    error: "password",
                    errorMsg: "Incorrect Password, please try again.",
                });
            }
        }
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// UPDATE USER
user.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const user = await getUserById(id);
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await updateUser(user, hashPassword);

        res.status(202).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Update was unsuccessful." });
    }
});

// UPDATE USER'S VOTES
user.put("/votes/:id/:votes", async (req, res) => {
    const { id, votes } = req.params;
    try {
        const updatedUser = await updateUserVotes(votes, id);

        res.status(202).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Update was unsuccessful." });
    }
});

// DELETE
user.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUser(id);
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(404).json({ error: "User was not found" });
    }
});

module.exports = user;

