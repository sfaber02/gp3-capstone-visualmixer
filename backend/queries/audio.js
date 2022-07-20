// DEPENDENCIES
const db = require("../db/dbConfig.js");

// GET ALL SONGS
const getAllAudio = async () => {
    try {
        const allAudio = await db.any("SELECT * FROM audio;");
        return allAudio;
    } catch (err) {
        return err;
    }
};

// GET ONE SONG
const getAAudio = async (id) => {
    try {
        const allAudio = await db.one(
            "SELECT * FROM audio WHERE audio_id=$1",
            id
        );
        return allAudio;
    } catch (err) {
        return err;
    }
};

// UPDATE A SONG
const updateAudio = async (track, id) => {
    try {
        const updatedAudio = await db.one(
            "UPDATE audio SET totalVotes=$1, used=$2 WHERE audio_id=$3 RETURNING *",
            [track.totalVotes, track.used, id]
        );
        return updatedAudio;
    } catch (err) {
        return err;
    }
};

// ADD A SONG
const createAudio = async (track) => {
    try {
        const newTrack = await db.one(
            "INSERT INTO audio (deezer_id, title, artist, album, album_cover, audio_key) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [
                track.deezerId,
                track.title,
                track.artist,
                track.album,
                track.cover,
                track.audioKey,
            ]
        );
        return newTrack;
    } catch (error) {
        return err;
    }
};

module.exports = {
    getAllAudio,
    updateAudio,
    getAAudio,
    createAudio,
};
