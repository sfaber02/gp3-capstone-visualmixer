// DEPENDENCIES
require("dotenv").config();
ACCESS_TOKEN = process.env.DEEZER_TOKEN;
PLAYLIST = process.env.PLAYLIST;

// TIGGER THIS FUNCTION ????

// GET PLAYLIST DATA
const getPlaylistData = async () => {
    let response = await fetch(`${PLAYLIST}?access_token=${ACCESS_TOKEN}`);
    let apiData = response.json();
};

// GET DB AUDIO DATA

// COMPARE AND FIND A TRACK NOT IN DB

// DEEZER API --> DELETE AUDIO FROM PLAYLIST

// ADD TRACK TO DB -> GRAB MOST RECENT ()

// UPDATE TRACK API CALL / DB
