// DEPENDENCIES
require("dotenv").config();
const { ACCESS_TOKEN, PLAYLIST } = process.env;

// GET PLAYLIST DATA
const getPlaylistData = async (id) => {
    let response = await fetch(
        `https://api.deezer.com/playlist/${id}?access_token=frFWCzAvVbxJ9C8E2G5EvEKmHrik3eGFQbVW8ACvMmtaDmQPTw`
    );
    let apiData = await response.json();
    return apiData.tracks.data;
};

// GET DB AUDIO DATA
const getDBAudioData = async () => {
    let response = await fetch("http://localhost:3333/audio");
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

    let post = await fetch("http://localhost:3333/audio", requestOptions);
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
        `https://api.deezer.com/playlist/10539515422/tracks?access_token=frFWCzAvVbxJ9C8E2G5EvEKmHrik3eGFQbVW8ACvMmtaDmQPTw&songs=${id}`,
        requestOptions
    );
};

// COMPARE AND FIND A TRACK NOT IN DB
const postNewTrack = async () => {
    const playlistData = await getPlaylistData(10539515422);
    const mixleData = await getDBAudioData();
    let newTrack;

    for (let song of playlistData) {
        if (!mixleData.includes(song.id)) {
            newTrack = song;
            break;
        }
    }

    const track = {
        deezerId: newTrack.id,
        title: newTrack.title,
        artist: newTrack.artist.name,
        album: newTrack.album.title,
        cover: newTrack.album.cover,
        audioKey: newTrack.preview,
    };

    let todaysTack = await sendAudioData(track);
    let deleted = await removeFromPlaylist(todaysTack.deezerId);
};

postNewTrack();

// UPDATE TRACK API CALL / DB

// RANDOM DEEZER SONG
