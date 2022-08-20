import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { useTrack } from "../../Contexts/SongContext";

import "../../Styles/mixer.css";
import "../../Styles/mixerSubComponentStyles/transport.css";

//MIXER SUB COMPONENTS
import { Visualizer } from "./MixerSubComponents/Visualizer";
import { Time } from "./MixerSubComponents/Time";
import { Delay } from "./MixerSubComponents/Delay";
import { PlaySpeed } from "./MixerSubComponents/PlaySpeed";
import { Compressor } from "./MixerSubComponents/Compressor";
import { Eq } from "./MixerSubComponents/Eq";
import Loading from "../Loading";

const API = process.env.REACT_APP_API_URL;

const Mixer = ({
    setFx,
    fx,
    setVolume,
    volume,
    playState,
    track,
    loading,
    analyserNode,
    time,
    handleSeek,
    handlePlayPause,
    playPause,
}) => {
    const navigate = useNavigate();
    const [userDetails] = useUser();
    const [todaysTrack] = useTrack();
    /**
     * On page load checks if there are FX settings stored in local storage.
     * This is used in the case that a user has created a mix without an account or being logged in.
     */
    useEffect(() => {
        const storedFx = JSON.parse(localStorage.getItem("temp_fx"));
        if (storedFx) {
            setFx(storedFx);
            localStorage.setItem("temp_fx", null);
        }
    }, []);

    /**
     * handles onChange event from all inputs in the mixer
     * dyanmically determines key based on <input> tags id property
     * ID needs to be in the format key.key OR for EQ settings key.key.key
     * (eg. id="delay.time" or id="eq.band1.gain")
     * @param {object} e
     */
    const handleSetFx = (e) => {
        const effect = e.target.id.split(".")[0];
        const param = e.target.id.split(".")[1];
        const eqParam =
            e.target.id.split(".").length > 2
                ? e.target.id.split(".")[2]
                : null;

        setFx((prev) => {
            if (eqParam) {
                return {
                    ...prev,
                    [effect]: {
                        ...prev[effect],
                        [param]: {
                            ...prev.eq[param],
                            [eqParam]: e.target.value,
                        },
                    },
                };
            } else {
                return {
                    ...prev,
                    [effect]: {
                        ...prev[effect],
                        [param]: e.target.value,
                    },
                };
            }
        });
    };

    /**
     * handles onChange event from master volume slider in transport controls
     * changes volumes of masterOutNode which is the last node in the FX chain
     * @param {object} e event object
     */
    const setMasterVolume = (e) => setVolume(e.target.value);

    /**
     * handle onClick event from "Save Mix" button
     * Checks local storage to determine if a user is logged in
     * If logged in Check if logged in user has already created a mix for specific track
     * -----If mix already exists update that mix
     * -----If mix does not exist POST a new mix
     * If not logged in save user's mix to local storage and navigate to the REGISTER page
     */
    const handleSaveClick = async () => {
        if (userDetails.accessToken) {
            try {
                const data = {
                    effects: JSON.stringify(fx),
                    user_id: userDetails.user_id,
                    audio_id: todaysTrack.audio_id,
                };

                const existResponse = await fetch(
                    `${API}/effects/exist/${todaysTrack.audio_id}/${userDetails.user_id}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userDetails.accessToken}`,
                        },
                    }
                );
                let method;

                const existContent = await existResponse.json();

                existContent ? (method = "PUT") : (method = "POST");

                const response = await fetch(`${API}/effects`, {
                    method: method,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userDetails.accessToken}`,
                    },
                    body: JSON.stringify(data),
                });
                const content = await response.json();

                if (playState.state === "playing") track.current.stop();
                navigate("/mixes");
            } catch (error) {
                console.log(error);
            }
        } else {
            localStorage.setItem("temp_fx", JSON.stringify(fx));
            if (playState.state === "playing") track.current.stop();
            navigate("/register");
        }
    };

    return (
        <>
            {/* DISPLAY LOADING PAGE UNTIL FETCH IS COMPLETE */}
            {loading ? (
                <Loading />
            ) : (
                // AFTER SONG FETCH DISPLAY MIXER / VISUALIZER
                <div id="mainMixerContainer">
                    <Visualizer analyserNode={analyserNode.current} />

                    <div id="transportContainer">
                        <div id="transportVolumeContainer">
                            <label htmlFor="volume">Volume</label>
                            <input
                                type="range"
                                id="volume"
                                className="mixleFader"
                                name="volume"
                                min="0"
                                max="1"
                                step=".05"
                                value={volume}
                                onChange={setMasterVolume}
                            />
                        </div>
                        <Time time={time} id="transportTimeContainer" />
                        <div id="transportSeekBarContainer">
                            <input
                                className="mixleFader"
                                id="seekBar"
                                type="range"
                                min="0"
                                max={time.duration}
                                step="1"
                                value={time.current}
                                // onMouseUp={handleSeek}
                                onChange={handleSeek}
                            />
                        </div>
                    </div>
                    <Delay handleSetFx={handleSetFx} fx={fx} />
                    <PlaySpeed handleSetFx={handleSetFx} fx={fx} />
                    <Compressor handleSetFx={handleSetFx} fx={fx} />
                    <div id="eqPlaySaveContainer">
                        <div id="playButtonContainer">
                            <button id="playButton" onClick={handlePlayPause}>
                                <span>
                                    {playPause ? (
                                        <i className="fa-solid fa-pause"></i>
                                    ) : (
                                        <i className="fa-solid fa-play"></i>
                                    )}
                                </span>
                            </button>
                        </div>
                        <Eq handleSetFx={handleSetFx} fx={fx} />
                        <div id="saveButtonContainer">
                            <button id="saveButton" onClick={handleSaveClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Mixer };
