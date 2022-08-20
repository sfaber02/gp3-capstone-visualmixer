// DEPENDENCIES
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// COMPONENTS
import SignUp from "./Components/Nav&Login/signUp";
import { MixerWrapper } from "./Components/mixersplashwrapper.js";
import { AudioPlayer } from "./Components/AudioPlayer/AudioPlayer";
import Loading from "./Components/Loading";
import Login from "./Components/Nav&Login/login";
import NavBar from "./Components/Nav&Login/navBar";
import AboutPopUp from "./Components/Nav&Login/AboutPopUp";
import Verification from "./Components/Nav&Login/Verification";

//CONTEXT
import { UserProvider } from "./Contexts/UserContext";

const API = process.env.REACT_APP_API_URL;

function App() {
    const [popupBtn, setPopupBtn] = useState(false);
    const [todaysTrack, setTodaysTrack] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!todaysTrack) {
            fetch(`${API}/audio/today`)
                .then((response) => response.json())
                .then((data) => {
                    setTodaysTrack(data);
                    setLoading(false);
                })
                .catch((err) => console.log(err));
        }
    }, []);

    return (
        <UserProvider>
            <main>
                <NavBar trigger={popupBtn} setTrigger={setPopupBtn} />
                <AboutPopUp trigger={popupBtn} setTrigger={setPopupBtn} />
                {!loading ? (
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={<MixerWrapper todaysTrack={todaysTrack} />}
                        />
                        <Route
                            path="/audio"
                            element={
                                <AudioPlayer
                                    todaysTrack={todaysTrack}
                                    mixes={true}
                                />
                            }
                        />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify/:id" element={<Verification />} />
                    </Routes>
                ) : (
                    <Loading />
                )}
            </main>
        </UserProvider>
    );
}

export default App;
