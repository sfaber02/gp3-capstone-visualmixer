function refreshCookie(tokens) {
    return (req, res, next) => {
        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        next();
    };
}

module.exports = refreshCookie;
