import React, { useEffect, useState } from "react";
import { AudioPlayer } from "./AudioPlayer/AudioPlayer.js";
import { SplashPage } from "./splashpage.js";

/**
 * A wrapper to hold mixer and splash pages
 * @returns Splash Page OR Mixer component depending on if "Start Mixing" button has been pressed
 */
const MixerWrapper = ({ todaysTrack }) => {
    const [showSplash, setShowSplash] = useState(true);

    const handleStartClick = () => setShowSplash(false);

    return (
        <>
            {showSplash ? (
                <SplashPage handleStartClick={handleStartClick} />
            ) : (
                <AudioPlayer
                    showSplash={showSplash}
                    todaysTrack={todaysTrack}
                    mixes={false}
                />
            )}
        </>
    );
};

export { MixerWrapper };
