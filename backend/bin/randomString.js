const randomString = () => {
  // considering a 8 length string
    const length = 8;
    let randStr = "";
    for(let i = 0; i < length; i++){
        // randNum => a number between 1 to 10
        const randNum = Math.floor((Math.random() * 10) + 1);
        randStr += randNum
    }

    return randStr;
}

module.exports = { randomString };