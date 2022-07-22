import React, {useState, useRef} from "react";

const AudioPlayer = () => {
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

















    return <div>AudioPlayer</div>;
};

export { AudioPlayer };
