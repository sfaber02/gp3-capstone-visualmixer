
const secondsTillMidnight = () => {
    // time in MS adjusted to EST
    let time = Date.now() - 4 * 60 * 60 * 1000;
    // number of seconds left till midnight EST
    let secondsLeft =
        ((24 * 60 * 60 * 1000) - (time % (24 * 60 * 60 * 1000))) / 1000;
    return secondsLeft;
};

export { secondsTillMidnight };