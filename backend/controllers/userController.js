// DEPENDENCIES
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtTokens = require("../validations/jwt-helpers");

// ENVIRONMENTAL VARS
require("dotenv").config();
// QUERIES
const {
    addUser,
    deleteUser,
    getUserByEmail,
    getUserByUserName,
    updateUser,
    getUserById,
    updateUserVotes,
    resetVotes,
} = require("../queries/users.js");

// CONFIGURATION
const user = express.Router();

// REGISTER REQUEST
user.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // CHECK IF EMAIL IS IN USE
        let dbUser = await getUserByEmail(email);

        if (dbUser.user_id) {
            res.status(400).json({
                error: "User with that email already exists.",
            });
            return;
        }
        // CHECK IF USERNAME IS IN USE
        dbUser = await getUserByUserName(username);

        if (dbUser.user_id) {
            res.status(400).json({
                error: "User with that username already exists.",
            });
            return;
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // CREATE NEW USER
            const user = await addUser(username, email, hashedPassword);

            // SEND VERIFICATION EMAIL?

            res.status(200).json({});
        } catch (error) {
            res.status(500).send(error, "Failed User creation Query");
        }
    } catch (error) {
        res.status(404).send("Post failed");
    }
});

// LOGIN REQUEST
user.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // GET USER DETAILS
        const user = await getUserByEmail(email);

        if (!user.email) {
            res.status(400).json({
                error: "email",
                errorMsg: "Incorrect email, please try again.",
            });
        } else if (!user.validated) {
            res.status(400).json({
                error: "verified",
                errorMsg: "Please verify your email.",
            });
        } else {
            // DECRYPT PASSWORD
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (isValidPassword) {
                // JWT TOKEN
                let tokens = jwtTokens(user);

                res.cookie("refresh_token", tokens.refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                res.status(200).json(tokens);
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
user.get("/refresh_token", (req, res) => {
    try {
        // USE REFRESH TOKEN TO GET NEW ACCESS TOKEN
        const refresh_token = req.cookies.refresh_token;

        if (!refresh_token) {
            return res.status(401).json({ error: "Null refresh token" });
        }

        jwt.verify(refresh_token, process.env.REFRESH_KEY, (error, user) => {
            if (error) {
                return res.status(403).json({ error: error.message });
            }

            let tokens = jwtTokens(user);
            res.cookie("refresh_token", tokens.refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            res.json(tokens);
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// RESET VOTES
user.get("/reset", async (req, res) => {
    try {
        const reset = await resetVotes();
        res.status(200).json({ success: "completed" });
    } catch (error) {
        res.status(404).json({ error: "unable to reset votes" });
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

// UPDATE A USER
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

// LOGOUT FUNCITONALITY
user.delete("/refresh_token", (req, res) => {
    try {
        res.clearCookie("refresh_token");
        return res.status(200).json({ message: "refresh token deleted" });
    } catch (error) {
        res.status().json({ error: error.message });
    }
});

// DELETE A USER
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
