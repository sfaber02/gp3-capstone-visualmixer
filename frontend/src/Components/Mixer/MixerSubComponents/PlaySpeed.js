import React from "react";
import "../../../Styles/mixerSubComponentStyles/playSpeed.css";

/**
 * Play Speed component of mixer
 * @param {object} props 
 * @param {object} fx from mixer component
 * @param {function} OnChange handler to set FX from mixer component  
 * 
 * @returns JSX for Play Speed section of mixer
 */
const PlaySpeed = (props) => {
    const fx = props.fx;
    const handleSetFx = props.handleSetFx;

    return (
        <div id="playSpeedContainer">
            <div className="playSpeedSliderContainer">
                <label className="playSpeedLabel" htmlFor="speed.rate">Speed</label>
                <input
                    id="speed.rate"
                    name="speed.rate"
                    className="playSpeedSliders"
                    type="range"
                    min=".1"
                    max="4"
                    step=".03"
                    value={fx.speed.rate}
                    onChange={handleSetFx}
                />
                <p className="playSpeedLabel2">{fx.speed.rate}</p>
            </div>
            <div className="playSpeedSliderContainer">
                <label className="playSpeedLabel" htmlFor="speed.detune">Detune</label>
                <input
                    id="speed.detune"
                    name="speed.detune"
                    className="playSpeedSliders"
                    type="range"
                    min="-2400"
                    max="2400"
                    step="100"
                    value={fx.speed.detune}
                    onChange={handleSetFx}
                />
                <p id="playSpeedDetuneLabel">{fx.speed.detune} cents</p>
            </div>
        </div>
    );
};

export { PlaySpeed };
