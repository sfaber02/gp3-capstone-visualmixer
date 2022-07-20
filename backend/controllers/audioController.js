// DEPENDENCIES
const express = require("express");
const audio = express.Router();
const {
    getAllAudio,
    updateAudio,
    getAAudio,
    createAudio,
    todaysTrack,
} = require("../queries/audio");

// GET TODAYS SONG
audio.get("/today", async (req, res) => {
    try {
        const todaysAudio = await todaysTrack();
        res.status(200).json(todaysAudio);
    } catch (error) {
        res.status(404).json({ error: err });
    }
});

// GET ONE SONG
audio.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allAudio = await getAAudio(id);
        res.status(200).json(allAudio);
    } catch (err) {
        res.status(404).json({ error: err });
    }
});

// GET ALL SONGS
audio.get("/", async (req, res) => {
    try {
        const allAudio = await getAllAudio();
        res.status(200).json(allAudio);
    } catch (err) {
        res.status(404).json({ error: err });
    }
});

// UPDATE SONG VOTES AND IF IT HAS BEEN USED BEFORE IN A PREVIOUS GAME
audio.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAudio = await updateAudio(req.body, id);
        res.status(200).json(updatedAudio);
    } catch (err) {
        res.status(404).json({ error: err });
    }
});

// ADD A SONG
audio.post("/", async (req, res) => {
    try {
        const { track } = req.body;
        const newAudio = await createAudio(track);
        res.status(200).json(newAudio);
    } catch (error) {
        res.status(404).json({ error: err });
    }
});

module.exports = audio;
