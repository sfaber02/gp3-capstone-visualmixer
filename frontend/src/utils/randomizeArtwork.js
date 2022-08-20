import artDB from "../Assets/albumArt/art.js";

const generatePhotoArray = (args) => {
    let randomArray = [];
    let albumArt = [];
    while (randomArray.length < artDB.length) {
        let newRandom = Math.floor(Math.random() * artDB.length);
        if (randomArray.includes(newRandom)) {
            continue;
        } else {
            randomArray.push(newRandom);
            albumArt.push(artDB[newRandom]);
        }
    }
    return albumArt;
};

export { generatePhotoArray };
