import { useState, useEffect, useRef, useCallback } from "react";

import MixCard from "./MixCard.js";

import { secondsTillMidnight } from "../../utils/countdown.js";

import artDB from "../../Actions/art.js";
import "../../Styles/mixes.css";

const API = process.env.REACT_APP_API_URL;

let randomArray = [];
while (randomArray.length < artDB.length) {
    let newRandom = Math.floor(Math.random() * artDB.length);
    if (randomArray.includes(newRandom)) {
        continue;
    } else {
        randomArray.push(newRandom);
    }
}

const Mixes = ({
    todaysTrack,
    setFx,
    fx,
    setVolume,
    volume,
    time,
    loading,
    handlePlayPause,
    playPause,
    handleSeek,
}) => {
    const [countdown, setCountdown] = useState();
    const countdownTimer = useRef();

    //states for vote tracking and updating
    // const [availableVotes, setAvailableVotes] = useState(0);
    const [user, setUser] = useState({ avaliablevotes: 0 });

    const [effects, setEffects] = useState([]);

    /**
     * LOAD ALL MIXES
     * FETCH SONG
     * FETCH USERS VOTES
     */
    useEffect(() => {
        if (todaysTrack) {
            //FETCH ALL MIXES FOR SONG ID
            fetch(`${API}/effects/allusers/${todaysTrack.audio_id}`)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    // console.log(data);
                    setEffects(data);
                })
                .catch((err) => {
                    console.log(err);
                });

            //IF USER IS LOGGED IN FETCH USER INFO AND SET AVAILABLE VOTES
            let user = JSON.parse(localStorage.getItem("user_id"));
            if (user) {
                var requestOptions = {
                    method: "GET",
                    redirect: "follow",
                };

                fetch(`${API}/user/${user}`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        setUser(result);
                    })
                    .catch((error) => console.log("error", error));
            }
        }
    }, [todaysTrack]);

    // countdown to next song timer
    useEffect(() => {
        if (!countdownTimer.current) {
            countdownTimer.current = setInterval(() => {
                const secondsLeft = secondsTillMidnight();
                const hoursLeft = Math.floor(secondsLeft / 60 / 60);
                const minsLeft = Math.floor((secondsLeft / 60) % 60);
                const secsLeft = Math.floor(
                    secondsLeft - hoursLeft * 60 * 60 - minsLeft * 60
                );
                setCountdown(
                    `${hoursLeft}:${
                        minsLeft < 10 ? `0${minsLeft}` : `${minsLeft}`
                    }:${secsLeft < 10 ? `0${secsLeft}` : `${secsLeft}`}`
                );
            }, 1000);
        }
    }, []);

    const handleUserChange = (user) => {
        //   console.log(user);
        for (let mix of effects) {
            // console.log (mix.user_id);
            if (mix.user_id == user) {
                //   console.log(mix.effects_data);
                setFx(mix.effects_data);
            }
        }
    };

    /**
     * handles onChange event from master volume slider in transport controls
     * changes volumes of masterOutNode which is the last node in the FX chain
     * @param {object} e
     */
    const setMasterVolume = (e) => {
        setVolume(e.target.value);
    };

    const subtractVote = () => {
        if (user.avaliablevotes > 0) {
            var requestOptions = {
                method: "PUT",
                redirect: "follow",
            };

            fetch(
                `${API}/user/votes/${user.user_id}/${user.avaliablevotes - 1}`,
                requestOptions
            )
                .then((response) => response.json())
                .then((result) => {
                    setUser((prev) => {
                        return {
                            ...prev,
                            avaliablevotes: result.avaliablevotes,
                        };
                    });
                })
                .catch((error) => console.log("error", error));
        }
    };

    return (
        <div id="mixesContainer">
            <div id="transportControlsContainer">
                <div id="transportVolumeContainerMixes">
                    <label htmlFor="volumeMixes">Volume</label>
                    <input
                        type="range"
                        id="volumeMixes"
                        name="volume"
                        min="0"
                        max="1"
                        step=".05"
                        value={volume}
                        onChange={setMasterVolume}
                    />
                </div>
                <div id="timer">
                    {`${Math.floor(time.current / 60)}:${
                        (time.current % 60).toFixed(0) < 10
                            ? `0${(time.current % 60).toFixed(0)}`
                            : (time.current % 60).toFixed(0)
                    }`}{" "}
                    / {"  "}
                    {`${Math.floor(time.duration / 60)}:${
                        (time.duration % 60).toFixed(0) < 10
                            ? `0${(time.duration % 60).toFixed(0)}`
                            : (time.duration % 60).toFixed(0)
                    }`}
                </div>
                <div id="playPause">
                    {!loading && (
                        <button onClick={handlePlayPause}>
                            {playPause ? (
                                <i className="fa-solid fa-pause"></i>
                            ) : (
                                <i className="fa-solid fa-play"></i>
                            )}
                        </button>
                    )}
                </div>
                <div id="seekbar">
                    <div id="transportSeekBarContainer">
                        <input
                            className="transportSlider"
                            id="seekBar"
                            type="range"
                            min="0"
                            max={time.duration}
                            step="1"
                            value={time.current}
                            onChange={handleSeek}
                        />
                    </div>
                </div>
                <div id="vote-time">
                    <div id="availableVotes">
                        Votes Left: {user.avaliablevotes}
                    </div>
                    <div id="countdown">New Mixle In: {countdown}</div>
                </div>
            </div>
            <div className={"music-card-container"}>
                {effects.map((effect, index) => (
                    <MixCard
                        key={effect.effects_id}
                        effect={effect}
                        handleUserChange={handleUserChange}
                        avaliableVotes={user.avaliablevotes}
                        subtractVote={subtractVote}
                        random={randomArray[index]}
                    />
                ))}
            </div>
        </div>
    );
};

export { Mixes };