import React from "react";
import {
    Navbar,
    Row,
    Col,
    Container,
    Popover,
    OverlayTrigger,
    Button,
} from "react-bootstrap";

import { Time } from "../Mixer/MixerSubComponents/Time.js";

export const Transport = ({
    loading,
    playPause,
    handlePlayPause,
    volume,
    time,
    handleSeek,
    votes,
    setMasterVolume,
}) => {
    const volumePopover = (
        <Popover>
            <Popover.Body>
                <input
                    type="range"
                    className="volumeMixes"
                    name="volume"
                    min="0"
                    max="1"
                    step=".05"
                    value={volume}
                    onChange={setMasterVolume}
                />
            </Popover.Body>
        </Popover>
    );

    return (
        <Container fluid className="mixesTransportContainer">
            <Row xs={1} className="">
                <Col xs={100} className="mixesSeekBarContainer mb-1">
                    <input
                        className="mixleFader  mixesSeekBar"
                        id="seekBar"
                        type="range"
                        min="0"
                        max={time.duration}
                        step="1"
                        value={time.current}
                        onChange={handleSeek}
                    />
                </Col>
            </Row>
            <Row xs={3} className="transportRow2">
                <Col className="">
                    {!loading && (
                        <button
                            onClick={handlePlayPause}
                            className="playPause transportButtons"
                        >
                            {playPause ? (
                                <i className="fa-solid fa-pause"></i>
                            ) : (
                                <i className="fa-solid fa-play"></i>
                            )}
                        </button>
                    )}
                </Col>
                <Col md="auto">
                    <Time time={time} id="timer" />
                </Col>
                <Col>
                    <Container>
                        <OverlayTrigger
                            trigger="click"
                            placement="top-end"
                            overlay={volumePopover}
                            rootClose={true}
                        >
                            <button className="volumeButton transportButtons">
                                <i className="fa-solid fa-volume-high"></i>
                            </button>
                        </OverlayTrigger>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

/*

 <Row xs={1} lg={3} className="w-100 border border-warning">
               
                <Col className="border border-warning">
                    <div id="vote-time">
                        <div id="available_votes">
                            Votes Left: {user.available_votes}
                        </div>
                        <div id="countdown">New Mixle In: {countdown}</div>
                    </div>
                </Col>
            </Row>
*/
