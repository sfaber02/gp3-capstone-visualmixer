import React, { useState, useEffect } from 'react';
import Name from './Name';
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

export default function MixCard({ audio }) {
    // const {title, artist, album} = audio
    // console.log(audio);
    const [ isHovered, setHovered] = useState(false);
    
    const handleResponse = () => {
        setHovered(!isHovered);
    }
    
    const handleClick = () =>{
        
    }
    
    const [ loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(true)
    }, [])

  return (
    <div className={"music-card"}>
        {
            !loaded ?
            <div className={"Skeleton-top"}>
                <Skeleton variant="rect" width={210} height={210} />
                <Box pt={0.5}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            </div>
                :
                <>
                    <div onClick={handleClick} className={"musi-card-cover"} onMouseOver={handleResponse}>
                        <img src={""} alt={""}/>
                        <div className='thumbs-up'>

                        </div>
                    </div>
                    <React.Fragment>
                        <Name name={audio.artist} className={"artist"} length={audio.artist.length} />
                        <Name name={audio.title} className={"title"} length={audio.title.length} />
                        <Name name={audio.album} className={"album"} length={audio.album.length} />
                    </React.Fragment>
                </>
        }
    </div>
  );
}
