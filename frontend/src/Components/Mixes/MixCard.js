import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";


import "../../Styles/scss/MixCard.scss";
import "../../Styles/mixCard.css";


const API = process.env.REACT_APP_API_URL;

const MixCard = ({
    effect,
    handleUserChange,
    avaliableVotes,
    subtractVote,
    albumArt,
    handleShow,
    userDetails
}) => {
    const [isHovered, setHovered] = useState(false);
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

        // CHECK HERE IF USER IS VERIFIED

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

    const handleResponse = () => {
        setHovered((prev) => !prev);
    };
    const handleMouseEnter = (e) => {
        handleUserChange(e.target.parentNode.id);
    };

    const handlePlayClick = (e) => {
        handleUserChange(e.target.className.split(" ")[0]);
    };

    return (
        <div className={"music-card"}>
            <Card
                id={effect.user_id}
                onClick={handleClick}
                className={"music-card-cover m-3"}
                onMouseOver={handleResponse}
                onMouseEnter={handleMouseEnter}  
            >
                <Card.Img src={imageSource} alt={"mixelArt"}></Card.Img>
                <Card.Body>
                    <Container>
                        <Row xs={3}>
                            <Col className="mixCardUser">{effect.username}</Col>
                            <Col >
                                <p>
                                    {votes}{"     "}
                                    <i class="fa-solid fa-thumbs-up"></i>
                                </p>
                            </Col>
                            <Col>
                                {" "}
                                <button
                                    className={`${effect.user_id} mixCardButton`}
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
}

export {MixCard};
