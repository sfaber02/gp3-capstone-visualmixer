// DEPENDENCIES
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// COMPONENTS
import SignUp from "./Components/Nav&Login/signUp";
import { SplashPage } from "./Components/splashpage";
import { AudioPlayer } from "./Components/AudioPlayer/AudioPlayer";
import Loading from "./Components/Loading";
import Login from "./Components/Nav&Login/login";
import NavBar from "./Components/Nav&Login/navBar";
import AboutPopUp from "./Components/Nav&Login/AboutPopUp";
import Verification from "./Components/Nav&Login/Verification";

//CONTEXT
import { UserProvider } from "./Contexts/UserContext";
import { TrackProvider } from "./Contexts/SongContext";

function App() {
    const [popupBtn, setPopupBtn] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <UserProvider>
            <TrackProvider>
                <main>
                    <NavBar trigger={popupBtn} setTrigger={setPopupBtn} />
                    <AboutPopUp trigger={popupBtn} setTrigger={setPopupBtn} />
                    {!loading ? (
                        <Routes>
                            <Route exact path="/" element={<SplashPage />} />
                            <Route path="mixer" element={<AudioPlayer mixes={false} />} />
                            <Route
                                path="/mixes"
                                element={<AudioPlayer mixes={true} />}
                            />
                            <Route path="/register" element={<SignUp />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/verify/:id"
                                element={<Verification />}
                            />
                        </Routes>
                    ) : (
                        <Loading />
                    )}
                </main>
            </TrackProvider>
        </UserProvider>
    );
}

export default App;
