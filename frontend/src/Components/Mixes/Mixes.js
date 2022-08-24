import { useState, useEffect, useRef } from "react";
import { useUser } from "../../Contexts/UserContext.js";
import { useTrack } from "../../Contexts/SongContext.js";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

import { MixCard } from "./MixCard.js";
import { Transport } from "./Transport.js";
import { secondsTillMidnight } from "../../utils/countdown.js";
import { generatePhotoArray } from "../../utils/randomizeArtwork";

import "../../Styles/mixes.css";

const API = process.env.REACT_APP_API_URL;

const Mixes = ({
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
    const [countdown, setCountdown] = useState(() => 0);
    const [show, setShow] = useState(false);
    const [albumArt, setAlbumArt] = useState(() => generatePhotoArray());
    const [userDetails] = useUser();
    const [todaysTrack] = useTrack();

    //states for vote tracking and updating
    // const [available_votes, setAvailable_votes] = useState(0);
    const [votes, setVotes] = useState(() => 0);
    const [effects, setEffects] = useState([]);

    // sets a custom VH height unit based on window size (used for mobile)
    useEffect(() => {
        const handleResize = () => {
            const vH = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vH}px`);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /**
     * LOAD ALL MIXES
     * FETCH USERS VOTES
     */
    useEffect(() => {
        if (todaysTrack) {
            //FETCH ALL MIXES FOR SONG ID
            fetch(`${API}/effects/allusers/${todaysTrack.audio_id}`, {
                headers: {
                    Authorization: `Bearer ${userDetails.accessToken}`,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setEffects(data);
                })
                .catch((err) => {
                    console.log(err);
                });

            //IF USER IS LOGGED IN FETCH USER INFO AND SET AVAILABLE VOTES
            if (userDetails.user_id) {
                let requestOptions = {
                    method: "GET",
                    redirect: "follow",
                };

                fetch(`${API}/user/${userDetails.user_id}`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result.available_votes);
                        setVotes(result.available_votes);
                    })
                    .catch((error) => console.log("error", error));
            }
        }
    }, [todaysTrack]);

    // countdown to next song timer
    useEffect(() => {
        // THIS IS CAUSING LOTS OF RE RENDERS ??
        // if (!countdownTimer.current) {
        //     countdownTimer.current = setInterval(() => {
        //         const secondsLeft = secondsTillMidnight();
        //         const hoursLeft = Math.floor(secondsLeft / 60 / 60);
        //         const minsLeft = Math.floor((secondsLeft / 60) % 60);
        //         const secsLeft = Math.floor(
        //             secondsLeft - hoursLeft * 60 * 60 - minsLeft * 60
        //         );
        //         setCountdown(
        //             `${hoursLeft}:${
        //                 minsLeft < 10 ? `0${minsLeft}` : `${minsLeft}`
        //             }:${secsLeft < 10 ? `0${secsLeft}` : `${secsLeft}`}`
        //         );
        //     }, 1000);
        // }
    }, []);

    const handleUserChange = (user) => {
        for (let mix of effects) {
            if (mix.user_id == user) {
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
        if (votes > 0) {
            var requestOptions = {
                method: "PUT",
                redirect: "follow",
            };

            fetch(
                `${API}/user/votes/${userDetails.user_id}/${votes - 1}`,
                requestOptions
            )
                .then((response) => response.json())
                .then((result) => {
                    setVotes(result.available_votes);
                })
                .catch((error) => console.log("error", error));
        }
    };

    // EVENT HANDLERS
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {/* MODAL FOR NO VOTES LEFT MESSAGE */}
            <Modal show={show} onHide={handleClose} keyboard={false}></Modal>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Sorry! You have no votes left for today!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" size="lg" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container>
                <Container className="cardsContainer mt-1">
                    <Row xs={1} s={1} md={2} lg={3} xl={4} className="g-0">
                        {effects.map((effect, index) => (
                            <Col key={index}>
                                <MixCard
                                    key={effect.effects_id}
                                    effect={effect}
                                    handleUserChange={handleUserChange}
                                    available_votes={votes}
                                    subtractVote={subtractVote}
                                    albumArt={albumArt[index]}
                                    handleShow={handleShow}
                                    userDetails={userDetails}
                                />
                            </Col>
                        ))}
                    </Row>
                </Container>

                <Transport
                    loading={loading}
                    playPause={playPause}
                    handlePlayPause={handlePlayPause}
                    volume={volume}
                    setVolume={setVolume}
                    time={time}
                    handleSeek={handleSeek}
                    votes={votes}
                    countdown={countdown}
                    setMasterVolume={setMasterVolume}
                />
            </Container>
        </>
    );
};

export { Mixes };
