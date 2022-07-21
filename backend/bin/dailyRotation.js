// DEPENDENCIES
// require("dotenv").config();
const axios = require("axios");
const { ACCESS_TOKEN, PLAYLIST } = process.env;

// GET PLAYLIST DATA FROM DEEZER
const getPlaylistData = async (id) => {
    try {
        let response = await axios.get(
            `https://api.deezer.com/playlist/${id}?access_token=${ACCESS_TOKEN}`
        );
        let data = await response.data;
        return data.tracks.data;
    } catch (error) {
        console.log("getPlaylistData");
        return error;
    }
};

// GET DB AUDIO DATA
const getDBAudioData = async () => {
    try {
        let response = await axios.get("https://mixle-be.herokuapp.com/audio");
        let data = await response.data;
        return data.map((item) => {
            return item.deezer_id;
        });
    } catch (error) {
        console.log("getDBAudioData");
        return error;
    }
};

// POST TO DB
const sendAudioData = async (track) => {
    try {
        let data = JSON.stringify({ track });

        let config = {
            method: "post",
            url: "https://mixle-be.herokuapp.com/audio",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        let post = await axios(config);
    } catch (error) {
        console.log("sendAudioData");
        return error;
    }
};

// DEEZER API --> DELETE AUDIO FROM PLAYLIST
const removeFromPlaylist = async (id) => {
    try {
        let deletedTrack = await axios.delete(
            `https://api.deezer.com/playlist/${PLAYLIST}/tracks?access_token=${ACCESS_TOKEN}&songs=${id}`
        );
    } catch (error) {
        console.log("removeFromPlaylist");
        return error;
    }
};

// RESET USERS VOTES
const resetUserVotes = async () => {
    try {
        let patch = await axios.get(
            "https://mixle-be.herokuapp.com/user/reset"
        );
    } catch (error) {
        console.log("resetUserVotes");
        return error;
    }
};

// COMPARE AND FIND A TRACK NOT IN DB
const postNewTrack = async () => {
    const playlistData = await getPlaylistData(PLAYLIST);
    const mixleData = await getDBAudioData();
    let newTrack;

    for (let song of playlistData) {
        if (!mixleData.includes(song.id)) {
            newTrack = song;
            break;
        }
    }
    // DEEZER TOP 100

    const track = {
        deezerId: newTrack.id,
        title: newTrack.title,
        artist: newTrack.artist.name,
        album: newTrack.album.title,
        cover: newTrack.album.cover,
        audioKey: newTrack.preview,
    };

    let todaysTrack = await sendAudioData(track);
    let deleted = await removeFromPlaylist(track.deezerId);
    let reset = await resetUserVotes();
};

postNewTrack();

// UPDATE TRACK API CALL / DB

// RANDOM DEEZER SONG
