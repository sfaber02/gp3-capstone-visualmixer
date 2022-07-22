import React, { useRef, useEffect } from "react";
import "../../../Styles/mixerSubComponentStyles/visualizer.css"

/**
 * Renders music visualizer based on audio data from analyser node
 * needs analyser node passed as a prop
 * @param {object} props
 * @param {audio node}
 * @returns visualizer component
 */
const Visualizer = (props) => {
    // Refs for canvas context element and analyser node
    const canvasCtx = useRef();
    const analyserNode = useRef(props.analyserNode);
    const canvas = useRef()
    const wrapper = useRef();

    /**
     * Component Did Mount wrapper to ensure <canvas> element exists before this code runs
     */
    useEffect(() => {
        //DOM elements for <canvas> element and the div it is contained in
        canvas.current = document.getElementById("visualizer");
        wrapper.current = canvas.current.parentNode;

        //Canvas window size settings
        canvas.current.width = wrapper.current.offsetWidth;
        canvas.current.height = wrapper.current.offsetHeight - 16;
        
        // On resize event listener to dyanmcally resize canvas.current when window is resized
        window.onresize = () => {
            canvas.current.width = wrapper.current.offsetWidth;
            canvas.current.height = wrapper.current.offsetHeight - 16;
        };

        //Create 2D canvas context for drawing the visualizer
        canvasCtx.current = canvas.current.getContext("2d");

        //Various parameters required for visualizer
        analyserNode.current.fftSize = 4096;
        let bufferLength = analyserNode.current.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        let barHeight;
        let x = 0;

        //Render a frame of the visualizer
        const renderFrame = () => {
            // console.log (canvas.current.width);
            const barWidth = (canvas.current.width / bufferLength) * 13.5;
            // console.log (canvas.current.width, canvas.current.height);
            requestAnimationFrame(renderFrame);
            x = 0;
            // console.log (analyserNode.current);

            //Grabs current frequency and amplitude of audio
            analyserNode.current.getByteFrequencyData(dataArray);

            // Clears canvas.current before rendering bars (black with opacity 0.2)
            canvasCtx.current.fillStyle = "rgba(0,0,0,1)";

            // Fade effect, set opacity to 1 for sharper rendering of bars
            canvasCtx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

            // variables for colors of visualizer bars and # of bars
            let r, g, b;
            let bars = 100;

            for (let i = 0; i < bars; i++) {
                barHeight = dataArray[i];
                // console.log (dataArray[i]);
                if (dataArray[i] > 210) {
                    // pink
                    r = 250;
                    g = 0;
                    b = 255;
                } else if (dataArray[i] > 200) {
                    // yellow
                    r = 250;
                    g = 255;
                    b = 0;
                } else if (dataArray[i] > 190) {
                    // yellow/green
                    r = 204;
                    g = 255;
                    b = 0;
                } else if (dataArray[i] > 180) {
                    // blue/green
                    r = 0;
                    g = 219;
                    b = 131;
                } else {
                    // light blue
                    r = 0;
                    g = 199;
                    b = 255;
                }

                //sets bar color based on amplitude
                canvasCtx.current.fillStyle = `rgb(${r},${g},${b})`;

                /**
                 * draws rectangle based on preset bar width and dyanmic frequency and amplitude
                 * param 1 = current x coord of bar's start point
                 * param 2 = current y coord of bar's start point
                 * param 3 = width of bar based on pre configured settings
                 * param 4 = height of bar based on amplitude of current frequency data 
                 */
                canvasCtx.current.fillRect(
                    x,
                    canvas.current.height - barHeight,
                    barWidth,
                    barHeight
                );

                //advances X coord to draw next bar
                x += barWidth + 6;
            }
        };
        renderFrame();
    }, []);

    return (
        <div id="visualizerContainer">
            <canvas id="visualizer"></canvas>
        </div>
    );
};

export { Visualizer };
