import React from "react";
import { Navbar, Row, Col, Container } from "react-bootstrap";

import { Time } from "../Mixer/MixerSubComponents/Time.js";

export const Transport = ({
    loading,
    playPause,
    handlePlayPause,
    volume,
    setVolume,
    time, 
    handleSeek,
    user,
    countdown,
    setMasterVolume
}) => {
    return (
        <Navbar fixed="bottom" className="border border-danger">
            <Container className="border border-success mw-100">
                <Row xs={1} lg={3} className="w-100">
                    <Col className="border border-warning">
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
                    </Col>
                    <Col className="border border-warning">
                        <Container>
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
                            <Time time={time} id="timer" />
                        </Container>
                    </Col>
                    <Col className="border border-warning">
                        <div id="vote-time">
                            <div id="availableVotes">
                                Votes Left: {user.avaliablevotes}
                            </div>
                            <div id="countdown">New Mixle In: {countdown}</div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
};
