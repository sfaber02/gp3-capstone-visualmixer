import { useNavigate } from "react-router-dom";

import Image from "../Assets/Mixle_Icon-Nobg.png";
import "../Styles/Splash.css";


// LANDING PAGE
function SplashPage() {
    const navigate = useNavigate();

    return (
        <section id="splashPageContainer">
            <div className="top_row">
                <img src={Image} alt="logo" className="logo" />
            </div>
            <div className="mid_row">
                <div id="splashButtonContainer">
                    <button id="splashButton" onClick={() => navigate('/mixer')}>
                        Start Mixing
                    </button>
                </div>
            </div>
            <div className="low_row">
                <h2>Music For Everyone</h2>
            </div>
        </section>
    );
}

export { SplashPage };
