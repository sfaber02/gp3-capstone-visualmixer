import React, { useState, useEffect, useRef } from "react";

import { defaultfx } from "../../settings/defaultfx";

import { Mixer } from "../Mixer/mixer";
import { Mixes } from "../Mixes/Mixes";

const AudioPlayer = ({ showSplash, todaysTrack, mixes }) => {
    /**
     * play/pause - boolean state for play/pause toggling
     * playstate - object state for tracking the current play state (e.g. 'playing', 'paused')
     * time - object state for current time of track / total duration of track
     * loading - boolean state for tracking if track is loaded
     * fx - object state of all FX parameters
     */
    const [playPause, setPlayPause] = useState(false);
    const [playState, setPlayState] = useState({ state: "stopped" });
    const [time, setTime] = useState({ current: 0, duration: 0 });
    const [loading, setLoading] = useState(true);
    const [fx, setFx] = useState(defaultfx);
    const [volume, setVolume] = useState(0.5);

    //Refs for time display
    const timer = useRef();
    const timerStart = useRef();
    const timerOffset = useRef();
    const loadStart = useRef();
    const seekOffset = useRef(0);
    const seekTimeStamp = useRef(0);

    //Refs for audio node and decoded audio array
    const track = useRef();
    const decodedAudio = useRef(false);

    //Refs for context elements
    const ctx = useRef();

    //Refs for delay nodes
    const delayNode = useRef();
    const feedbackNode = useRef();
    const dryNode = useRef();
    const wetNode = useRef();
    const delayOutNode = useRef();

    //Refs for EQ nodes
    const band1 = useRef();
    const band2 = useRef();
    const band3 = useRef();
    const band4 = useRef();
    const band5 = useRef();

    //Ref for Compressor node
    const compressorNode = useRef();

    //Ref for analyser node
    const analyserNode = useRef();

    //Ref for master out
    const masterOutNode = useRef();

    //trigger song fetch after a user interaction has occurred
    useEffect(() => {
        if (!showSplash && todaysTrack.audio_key) {
            
            //Create audio context
            ctx.current = new (window.AudioContext ||
                window.webkitAudioContext)();

            loadStart.current = Date.now();

            //Create Delay Nodes
            delayNode.current = ctx.current.createDelay();
            feedbackNode.current = ctx.current.createGain();
            dryNode.current = ctx.current.createGain();
            wetNode.current = ctx.current.createGain();
            delayOutNode.current = ctx.current.createGain();

            // //Create Analyser Node
            analyserNode.current = ctx.current.createAnalyser();

            // //Create Filter Nodes
            band1.current = ctx.current.createBiquadFilter();
            band2.current = ctx.current.createBiquadFilter();
            band3.current = ctx.current.createBiquadFilter();
            band4.current = ctx.current.createBiquadFilter();
            band5.current = ctx.current.createBiquadFilter();

            // Changing default filters
            band1.current.type = "lowshelf";
            band2.current.type = "peaking";
            band3.current.type = "peaking";
            band4.current.type = "peaking";
            band5.current.type = "highshelf";

            // //Create Compressor Node
            compressorNode.current = ctx.current.createDynamicsCompressor();

            // Create Master Out Node
            masterOutNode.current = ctx.current.createGain();

            //

            //Fetch Song from Server and decode audio for playback
            fetch(todaysTrack.audio_key)
                .then((data) => data.arrayBuffer())
                .then((arrayBuffer) => ctx.current.decodeAudioData(arrayBuffer))
                .then((decodedAudio) => {
                    timerOffset.current =
                        (Date.now() - loadStart.current) / 1000;
                    createTrackNode(decodedAudio);
                })
                .catch((err) => console.log(err));
        }
    }, [showSplash, todaysTrack]);

    /**
     * Creates a track node from decoded audio
     * @param {array} audio - decoded audio from fetch
     */
    const createTrackNode = (audio) => {
        //store decoded audio in ref for future use
        if (!decodedAudio.current) decodedAudio.current = audio;

        //create a new audio source from decoded audio
        track.current = ctx.current.createBufferSource();
        track.current.buffer = decodedAudio.current;

        //intialize time state, set loading state
        setTime({
            current: 0,
            duration: track.current.buffer.duration,
        });
        setLoading(false);

        connectNodes();
    };

    /**
     * Connects audio nodes together to create FX chain
     *
     * FX CHAIN:
     * Track buffer source -> (split to dry node & delay node)
     * ------dry node -> delay Out node
     * ------delay node -> delay feedback -> delay -> wet node -> delay out node
     * delay out node -> band 1 -> band 2 -> band 3 -> band 4 -> band 5
     * band 5 -> compressor node -> analyser node -> master out node -> ctx.destination(this is the audio out)
     *
     */
    const connectNodes = () => {
        // delay path dry signal
        track.current.connect(dryNode.current);
        dryNode.current.connect(delayOutNode.current);

        //delay path wet signal
        track.current.connect(delayNode.current);
        delayNode.current.connect(feedbackNode.current);
        feedbackNode.current.connect(delayNode.current);
        delayNode.current.connect(wetNode.current);
        wetNode.current.connect(delayOutNode.current);

        //delay output
        delayOutNode.current.connect(band1.current);

        //eq path
        band1.current.connect(band2.current);
        band2.current.connect(band3.current);
        band3.current.connect(band4.current);
        band4.current.connect(band5.current);
        band5.current.connect(compressorNode.current);

        //compressor path
        compressorNode.current.connect(analyserNode.current);

        //analyser path
        analyserNode.current.connect(masterOutNode.current);

        //Master Out Node
        masterOutNode.current.connect(ctx.current.destination);
    };

    /**
     * Updates settings of audio nodes when FX state changes
     * FX state will change from user inputs OR if there are fx in local storage from a save mix/no user scenario
     */
    useEffect(() => {
        if (!loading) {
            //Set play speed
            track.current.playbackRate.value = fx.speed.rate;
            track.current.detune.value = fx.speed.detune;

            //Set Delay settings
            delayNode.current.delayTime.value = fx.delay.time;
            feedbackNode.current.gain.value = fx.delay.feedback;
            dryNode.current.gain.value = fx.delay.dry;
            wetNode.current.gain.value = fx.delay.wet;

            // SET EQ settings
            band1.current.frequency.value = fx.eq.band1.frequency;
            band2.current.frequency.value = fx.eq.band2.frequency;
            band3.current.frequency.value = fx.eq.band3.frequency;
            band4.current.frequency.value = fx.eq.band4.frequency;
            band5.current.frequency.value = fx.eq.band5.frequency;

            band1.current.gain.value = fx.eq.band1.gain;
            band2.current.gain.value = fx.eq.band2.gain;
            band3.current.gain.value = fx.eq.band3.gain;
            band4.current.gain.value = fx.eq.band4.gain;
            band5.current.gain.value = fx.eq.band5.gain;

            //Set compressor settings
            compressorNode.current.threshold.value = fx.compressor.threshold;
            compressorNode.current.ratio.value = fx.compressor.ratio;
            compressorNode.current.attack.value = fx.compressor.attack;
            compressorNode.current.release.value = fx.compressor.release;
        }
    }, [loading, fx]);

    /**
     * Creates an interval function to update the timer if song is playing
     */
    const startTimer = () => {
        timerStart.current = Date.now();
        if (!timer.current) {
            timer.current = setInterval(() => {
                setTime((prev) => {
                    return {
                        ...prev,
                        current:
                            seekOffset.current > 0
                                ? seekOffset.current +
                                  (ctx.current.currentTime -
                                      seekTimeStamp.current)
                                : ctx.current.currentTime -
                                  (timerStart.current - loadStart.current) /
                                      1000 +
                                  seekOffset.current,
                    };
                });
            }, 50);
        }
    };

    /**
     * handles onClick event from Play/Pause button
     * refers to playState state to determine what actions needs to happen
     * also updates PlayPause state to flip play button icon between play/pause
     */
    const handlePlayPause = () => {
        if (playState.state === "stopped") {
            track.current.start(ctx.current.currentTime);
            startTimer();
            setPlayState({ state: "playing" });
        } else if (playState.state === "playing") {
            ctx.current.suspend();
            setPlayState({ state: "paused" });
        } else if (playState.state === "paused") {
            ctx.current.resume();
            setPlayState({ state: "playing" });
        }
        setPlayPause((prev) => !prev);
    };

    /**
     * handles onChange event from Seekbar <input> element
     * Refers to play state to decided what actions need to happen for accurate seeking
     * @param {object} e
     */
    const handleSeek = (e) => {
        seekOffset.current = Number(e.target.value);
        seekTimeStamp.current = ctx.current.currentTime;
        
        if (playState.state === "playing") {
            // wrapped this stop command in a try/catch because it was erroring out occasionally
            try {
                track.current.stop();
            } catch (err) {
                console.log(err);
            }
            createTrackNode(decodedAudio.current);
            track.current.start(0.01, e.target.value);
            //Set play speed
            track.current.playbackRate.value = fx.speed.rate;
            track.current.detune.value = fx.speed.detune;
        } else if (playState.state === "stopped") {
            track.current.start(0, e.target.value);
            startTimer();
            setPlayState({ state: "playing" });
            setPlayPause(true);
        } else if (playState.state === "paused") {
            track.current.stop();
            createTrackNode(decodedAudio.current);
            track.current.start(0, e.target.value);
            ctx.current.suspend();
        }
    };

    useEffect(() => {
        if (todaysTrack) {
            masterOutNode.current.gain.value = Number(volume);
        }
    }, [volume]);

    return (
        <>
            {!mixes ? (
                <Mixer
                    setFx={setFx}
                    setVolume={setVolume}
                    volume={volume}
                    fx={fx}
                    playState={playState}
                    track={track}
                    loading={loading}
                    analyserNode={analyserNode}
                    setTime={setTime}
                    time={time}
                    handleSeek={handleSeek}
                    handlePlayPause={handlePlayPause}
                    playPause={playPause}
                    todaysTrack={todaysTrack}
                />
            ) : (
                <Mixes
                    setFx={setFx}
                    fx={fx}
                    setVolume={setVolume}
                    volume={volume}
                    time={time}
                    loading={loading}
                    handlePlayPause={handlePlayPause}
                    playPause={playPause}
                    handleSeek={handleSeek}
                    todaysTrack={todaysTrack}
                />
            )}
        </>
    );
};

export { AudioPlayer };
