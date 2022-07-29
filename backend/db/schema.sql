DROP DATABASE IF EXISTS mixle;
CREATE DATABASE mixle;

\c mixle;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    avaliableVotes INTEGER DEFAULT 3,
    validated BOOLEAN DEFAULT FALSE,
    confirmationCode VARCHAR UNIQUE
);

CREATE TABLE audio (
    audio_id SERIAL PRIMARY KEY,
    deezer_id INT,
    title VARCHAR,
    artist VARCHAR,
    album VARCHAR,
    album_cover TEXT,
    audio_key TEXT
);

CREATE TABLE effects (
    effects_id SERIAL PRIMARY KEY,
    effects_data JSON,
    audio INTEGER REFERENCES audio (audio_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
    totalVotes INTEGER DEFAULT 0 CHECK (totalVotes >= 0 )
);