const fetch = require("node-fetch");

// DEPENDENCIES
const { ACCESS_TOKEN, PLAYLIST } = process.env;

// GET PLAYLIST DATA FROM DEEZER
const getPlaylistData = async (id) => {
    let response = await fetch(
        `https://api.deezer.com/playlist/${id}?access_token=${ACCESS_TOKEN}`
    );
    let apiData = await response.json();
    return apiData.tracks.data;
};

// GET DB AUDIO DATA
const getDBAudioData = async () => {
    let response = await fetch("https://mixle-be.herokuapp.com/audio");
    let apiData = await response.json();
    return apiData.map((item) => {
        return item.deezer_id;
    });
};

// POST TO DB
const sendAudioData = async (track) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({ track });

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    let post = await fetch(
        "https://mixle-be.herokuapp.com/audio",
        requestOptions
    );
};

// DEEZER API --> DELETE AUDIO FROM PLAYLIST
const removeFromPlaylist = async (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
    };

    let deletedTacl = await fetch(
        `https://api.deezer.com/playlist/${PLAYLIST}/tracks?access_token=${ACCESS_TOKEN}&songs=${id}`,
        requestOptions
    );
};

// RESET USERS VOTES
const resetUserVotes = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
    };

    let patch = await fetch(
        "https://mixle-be.herokuapp.com/user/reset",
        requestOptions
    );
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
