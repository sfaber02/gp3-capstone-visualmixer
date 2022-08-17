// DEPENDENCIES
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.header("authorization"); // Bearer TOKEN
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Null Token" });
    }

    // VERIFY TOKEN
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ error: error.message });
        }

        //PAYLOAD FROM TOKEN
        req.user = user;

        next();
    });
}

module.exports = authenticateToken;
