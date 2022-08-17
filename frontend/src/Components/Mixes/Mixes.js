import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

import MixCard from "./MixCard.js";

import { Transport } from "./Transport.js";

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
    userDetails,
}) => {
    const [countdown, setCountdown] = useState(() => 0);
    const countdownTimer = useRef();
    const [show, setShow] = useState(false);

    //states for vote tracking and updating
    // const [availableVotes, setAvailableVotes] = useState(0);
    const [user, setUser] = useState({ avaliablevotes: 0 });

    const [effects, setEffects] = useState([]);


    console.log("MIXES RE RENDER");


    /**
     * LOAD ALL MIXES
     * FETCH SONG
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
            if (userDetails.accessToken) {
                let requestOptions = {
                    method: "GET",
                    redirect: "follow",
                };

                fetch(`${API}/user/${userDetails.user_id}`, requestOptions)
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
                `${API}/user/votes/${userDetails.user_id}/${
                    user.avaliablevotes - 1
                }`,
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
                <Container className="mt-4">
                    <Row xs={1} s={1} md={3} lg={4}>
                        {effects.map((effect, index) => (
                            <Col key={index}>
                                <MixCard
                                    key={effect.effects_id}
                                    effect={effect}
                                    handleUserChange={handleUserChange}
                                    avaliableVotes={user.avaliablevotes}
                                    subtractVote={subtractVote}
                                    random={randomArray[index]}
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
                    user={user}
                    countdown={countdown}
                    setMasterVolume={setMasterVolume}
                />
            </Container>
        </>
    );
};

export { Mixes };
