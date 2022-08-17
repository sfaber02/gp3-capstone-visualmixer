import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/scss/MixCard.scss";
import "../../Styles/mixCard.css";
import { Card, Modal, Button } from "react-bootstrap";


// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import Skeleton from "@mui/material/Skeleton";
// import Box from "@mui/material/Box";

import artDB from "../../Actions/art";

const API = process.env.REACT_APP_API_URL;

export default function MixCard({
    effect,
    handleUserChange,
    avaliableVotes,
    subtractVote,
    random,
}) {
    const [isHovered, setHovered] = useState(false);
    const [votes, setVotes] = useState(effect.totalvotes);
    const [imageSource, setImageSource] = useState(artDB[random]);
    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    
    const handleClick = () => {
        let user = JSON.parse(localStorage.getItem("user_id"));
        
        // CHECK HERE IF USER IS VERIFIED
        
        if (user) {
            if (avaliableVotes > 0) {
                setVotes((p) => (p += 1));
                subtractVote();
            } else {
                handleShow();
            }
        } else {
            navigate("/register");
        }
    };
    
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
    

    // EVENT HANDLERS
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleResponse = () => {
        setHovered(prev => !prev);
    };
    const handleMouseEnter = (e) => {
        handleUserChange(e.target.parentNode.id);
    };

    const handlePlayClick = (e) => {
        handleUserChange(e.target.className.split(" ")[0]);
    };

    return (
        <div className={"music-card"}>
            <>
                {/* MODAL FOR NO VOTES LEFT MESSAGE */}
                <Modal
                    show={show}
                    onHide={handleClose}
                    keyboard={false}
                ></Modal>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Sorry! You have no votes left for today!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

            <Card
                id={effect.user_id}
                onClick={handleClick}
                className={"music-card-cover"}
                onMouseOver={handleResponse}
                onMouseEnter={handleMouseEnter}
            >
                <Card.Img src={imageSource} alt={"mixelArt"}></Card.Img>
                <Card.Body>
                    <div className="mixCardInfo">
                        {effect.username}
                        <p>
                            {votes}
                            <i class="fa-solid fa-thumbs-up"></i>
                        </p>
                        <button
                            className={`${effect.user_id} mixCardButton`}
                            onClick={handlePlayClick}
                        >
                            <i
                                className={`${effect.user_id} fa-solid fa-play`}
                            ></i>
                        </button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
