const jwt = require("jsonwebtoken");

function jwtTokens({ user_id, username, email }) {
    const user = { user_id, username, email };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "2hr",
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_KEY, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}

module.exports = jwtTokens;
