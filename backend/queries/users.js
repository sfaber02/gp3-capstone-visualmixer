const db = require("../db/dbConfig.js");

// GET USER BY EMAIL
const getUserByEmail = async (email) => {
    try {
        const user = await db.one(
            "SELECT * FROM users WHERE email = $1",
            email
        );
        return user;
    } catch (error) {
        return error;
    }
};

// GET USER BY USERNAME
const getUserByUserName = async (username) => {
    try {
        const user = await db.one(
            "SELECT * FROM users WHERE username= $1",
            username
        );
        return user;
    } catch (error) {
        return error;
    }
};

// GET USER BY USER_ID
const getUserById = async (id) => {
    try {
        const newUserId = await db.one(
            "SELECT * FROM users WHERE user_id=$1",
            id
        );
        return newUserId;
    } catch (error) {
        return error;
    }
};

// CREATE A USER
const addUser = async (name, email, password, token) => {
    try {
        const newUser = await db.one(
            "INSERT INTO users (username, email, password, confirmationCode, date_created) VALUES ($1,$2,$3,$4,$5) RETURNING user_id, email, username",
            [name, email, password, token, Date.now()]
        );
        return newUser;
    } catch (err) {
        return err;
    }
};

// UPDATE A USER
const updateUser = async (user, password) => {
    try {
        const updatedUser = await db.one(
            "UPDATE users SET username=$1, email=$2, password=$3, available_votes=$4 WHERE user_id=$5 RETURNING username",
            [
                user.username,
                user.email,
                password,
                user.available_votes,
                user.user_id,
            ]
        );
        return updatedUser;
    } catch (err) {
        return err;
    }
};

// PATCH VALIDATION
const updateUserValidation = async (token) => {
    try {
        const updatedUser = await db.one(
            "UPDATE users SET validated=true WHERE confirmationCode=$1 RETURNING *",
            token
        );
        return updatedUser;
    } catch (error) {
        return error;
    }
};

// UPDATE USER'S VOTES
const updateUserVotes = async (votes, user_id) => {
    try {
        const updatedUser = await db.one(
            "UPDATE users SET available_votes=$1 WHERE user_id=$2 RETURNING available_votes;",
            [votes, user_id]
        );
        return updatedUser;
    } catch (err) {
        return err;
    }
};

// DELETE A USER
const deleteUser = async (id) => {
    try {
        const deletedUser = await db.one(
            "DELETE FROM users WHERE user_id = $1 RETURNING username",
            id
        );
        return deletedUser;
    } catch (err) {
        return err;
    }
};

// RESET USER VOTES
const resetVotes = async () => {
    try {
        const reset = await db.query("UPDATE users SET available_votes = 3");
    } catch (error) {
        return error;
    }
};

module.exports = {
    addUser,
    deleteUser,
    updateUser,
    getUserById,
    updateUserVotes,
    resetVotes,
    getUserByEmail,
    getUserByUserName,
    updateUserValidation,
};
