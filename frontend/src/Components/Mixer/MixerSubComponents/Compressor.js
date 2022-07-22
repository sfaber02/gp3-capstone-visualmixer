import React from "react";
import "../../../Styles/mixerSubComponentStyles/compressor.css";

/**
 * Compressor component of mixer
 * @param {object} props 
 * @param {object} fx from mixer component
 * @param {function} OnChange handler to set FX from mixer component  
 * 
 * @returns JSX for Compressor section of mixer
 */
const Compressor = (props) => {
    const fx = props.fx;
    const handleSetFx = props.handleSetFx;

    return (
        <div id="compressorContainer">
            <p id="compressorP">Compressor</p>
            <div className="compressorSliderContainer">
                <label className="compressorLabel" htmlFor="compressor.threshold">
                    Threshold
                </label>
                <input
                    id="compressor.threshold"
                    name="compressor.threshhold"
                    className="compressorSliders"
                    type="range"
                    min="-60"
                    max="0"
                    step="1"
                    value={fx.compressor.threshold}
                    onChange={handleSetFx}
                />
                <p className="compressorLabel2">
                    {fx.compressor.threshold}
                </p>
            </div>
            <div className="compressorSliderContainer">
                <label htmlFor="compressor.ratio">Ratio</label>
                <input
                    id="compressor.ratio"
                    name="compressor.ratio"
                    className="compressorSliders"
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={fx.compressor.ratio}
                    onChange={handleSetFx}
                />
                <p className="compressorLabel2">
                    1:{fx.compressor.ratio}
                </p>
            </div>
            <div className="compressorSliderContainer">
                <label htmlFor="compressor.attack">Attack</label>
                <input
                    id="compressor.attack"
                    name="compressor.attack"
                    className="compressorSliders"
                    type="range"
                    min="0"
                    max="1"
                    step=".001"
                    value={fx.compressor.attack}
                    onChange={handleSetFx}
                />
                <p className="compressorLabel2">
                    {fx.compressor.attack * 1000}ms
                </p>
            </div>
            <div className="compressorSliderContainer">
                <label htmlFor="compressor.release">Release</label>
                <input
                    id="compressor.release"
                    name="compressor.release"
                    className="compressorSliders"
                    type="range"
                    min="0"
                    max="1"
                    step=".001"
                    value={fx.compressor.release}
                    onChange={handleSetFx}
                />
                <p className="compressorLabel2">
                    {fx.compressor.release * 1000}ms
                </p>
            </div>
        </div>
    );
};

export { Compressor };
