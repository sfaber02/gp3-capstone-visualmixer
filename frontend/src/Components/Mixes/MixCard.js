import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, OverlayTrigger } from "react-bootstrap";

import "../../Styles/mixCard.css";

const API = process.env.REACT_APP_API_URL;

const MixCard = ({
    effect,
    handleUserChange,
    avaliableVotes,
    subtractVote,
    albumArt,
    handleShow,
    userDetails,
}) => {
    const [hovered, setHovered] = useState(false);
    const [votes, setVotes] = useState(() => effect.totalvotes);
    const [imageSource, setImageSource] = useState(() => albumArt);

    const navigate = useNavigate();

    // UPDATES FX IN DB WITH NEW VOTES COUNT
    useEffect(() => {
        var requestOptions = {
            method: "PUT",
            redirect: "follow",
        };

        fetch(`${API}/effects/${effect.effects_id}/${votes}`, requestOptions)
            .then((response) => response.text())
            .catch((error) => console.log("error", error));
    }, [votes]);

    const handleClick = () => {
        if (userDetails.user_id) {
            fetch(`${API}/user/${userDetails.user_id}`)
                .then((res) => res.json())
                .then((res) => {
                    if (res.validated) {
                        if (avaliableVotes > 0) {
                            setVotes((p) => (p += 1));
                            subtractVote();
                        } else {
                            handleShow();
                        }
                    } else {
                        // REGISTERED BUT NOT VERIFIED
                        alert("Please verify your email.");
                    }
                });
        } else {
            navigate("/register");
        }
    };

    const handleMouseEnter = (e) => {
        setHovered(true);
        handleUserChange(e.target.parentNode.id);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handlePlayClick = (e) => {
        handleUserChange(e.target.className.split(" ")[0]);
    };

    return (
        <div className={"music-card"}>
            <Card
                id={effect.user_id}
                className={"music-card-cover m-2"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Card.Img
                    className="card-img"
                    src={imageSource}
                    alt={"mixelArt"}
                ></Card.Img>
                {hovered && (
                    <>
                        <div className="thumbs-up-overlay-container"></div>
                        <div
                            className="overlay-thumbs-up"
                            onClick={handleClick}
                        >
                            <i class="fa-solid fa-thumbs-up thumbs-up"></i>
                        </div>
                    </>
                )}
                <Card.Body className="mt-1 p-0">
                    <Container className="mixCardInfo">
                        <Row xs={3}>
                            <Col className="mixCardUser">{effect.username}</Col>
                            <Col className="mixCardVotes">
                                <p>
                                    {votes}
                                    {"     "}
                                    <i class="fa-solid fa-thumbs-up"></i>
                                </p>
                            </Col>
                            <Col className="mixCardPlay">
                                {" "}
                                <button
                                    className={`${effect.user_id} transportButtons`}
                                    onClick={handlePlayClick}
                                >
                                    <i
                                        className={`${effect.user_id} fa-solid fa-play`}
                                    ></i>
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );
};

export { MixCard };
