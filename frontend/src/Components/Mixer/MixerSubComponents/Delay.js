import React from "react";
import "../../../Styles/mixerSubComponentStyles/delay.css";

/**
 * Delay component of mixer
 * @param {object} props 
 * @param {object} fx from mixer component
 * @param {function} OnChange handler to set FX from mixer component  
 * 
 * @returns JSX for Delay section of mixer
 */
const Delay = (props) => {
    const fx = props.fx;
    const handleSetFx = props.handleSetFx;

    return (
        <div id="delayContainer">
            <p id="delayP">Delay</p>
            <div className="delaySliderContainer">
                <label className="delayLabel" htmlFor="delay.time">Time</label>
                <input
                    id="delay.time"
                    name="delay.time"
                    className="delaySliders"
                    type="range"
                    min="0"
                    max="1"
                    step=".01"
                    value={fx.delay.time}
                    onChange={handleSetFx}
                />
                <p className="delayLabel2">{fx.delay.time * 1000}ms</p>
            </div>
            <div className="delaySliderContainer">
                <label htmlFor="delay.feedback">Feedback</label>
                <input
                    id="delay.feedback"
                    name="delay.feedback"
                    className="delaySliders"
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    value={fx.delay.feedback}
                    onChange={handleSetFx}
                />
                <p>{(fx.delay.feedback * 100).toFixed(0)}%</p>
            </div>
            <div className="delaySliderContainer">
                <label htmlFor="delay.dry">Dry</label>
                <input
                    id="delay.dry"
                    name="delay.dry"
                    type="range"
                    className="delaySliders"
                    min="0"
                    max="1"
                    step=".05"
                    value={fx.delay.dry}
                    onChange={handleSetFx}
                />
                <p>{(fx.delay.dry * 100).toFixed(0)}%</p>
            </div>
            <div className="delaySliderContainer">
                <label htmlFor="delay.wet">Wet</label>
                <input
                    id="delay.wet" 
                    name="delay.wet" 
                    className="delaySliders"
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    value={fx.delay.wet}
                    onChange={handleSetFx}
                />
                <p>{(fx.delay.wet * 100).toFixed(0)}%</p>
            </div>
        </div>
    );
};

export { Delay };
