const db = require("../db/dbConfig.js");

// VALIDATE USER EMAIL
const doesUserExist = async (email) => {
    try {
        const exists = await db.query(
            `SELECT EXISTS (SELECT 1 FROM users WHERE email=$1)`,
            [email]
        );
        return exists[0].exists;
    } catch (err) {
        return error;
    }
};

// SELECT SPECIFIC USER
const getUser = async (email) => {
    try {
        const newUser = await db.one(
            "SELECT * FROM users WHERE email = $1",
            email
        );
        return newUser;
    } catch (error) {
        return error;
    }
};

// GET USER ROW BY USER ID
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
const addUser = async (name, email, password) => {
    try {
        const newUser = await db.one(
            "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING user_id, email, username",
            [name, email, password]
        );
        return newUser;
    } catch (err) {
        return err;
    }
};

// UPDATE USER
const updateUser = async (user, password) => {
    try {
        const updatedUser = await db.one(
            "UPDATE users SET username=$1, email=$2, password=$3, avaliableVotes=$4 WHERE user_id=$5 RETURNING username",
            [
                user.username,
                user.email,
                password,
                user.availableVotes,
                user.user_id,
            ]
        );
        return updatedUser;
    } catch (err) {
        return err;
    }
};

// UPDATE USER'S VOTES
const updateUserVotes = async (votes, user_id) => {
    console.log(votes, user_id);
    try {
        const updatedUser = await db.one(
            "UPDATE users SET avaliableVotes=$1 WHERE user_id=$2 RETURNING avaliableVotes;",
            [
                votes,
                user_id
            ]
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

module.exports = {
    doesUserExist,
    addUser,
    deleteUser,
    getUser,
    updateUser,
    getUserById,
    updateUserVotes,
};
