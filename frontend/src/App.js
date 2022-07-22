// DEPENDENCIES
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// COMPONENTS
import SignUp from "./Components/Nav&Login/signUp";
import { MixerWrapper } from "./Components/mixersplashwrapper.js";
import Login from "./Components/Nav&Login/login";
import NavBar from "./Components/Nav&Login/navBar";
import { Mixes } from "./Components/Mixes/Mixes";
import AboutPopUp from "./Components/Nav&Login/AboutPopUp";

function App() {
    const [popupBtn, setPopupBtn] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: JSON.parse(localStorage.getItem("username")),
        user_id: JSON.parse(localStorage.getItem("user_id")),
    });
    const [todaysTrack, setTodaysTrack] = useState();

    useEffect(() => {
        setUserDetails({
            username: JSON.parse(localStorage.getItem("username")),
            user_id: JSON.parse(localStorage.getItem("user_id")),
        });
    }, []);

    useEffect(() => {
        fetch("https://mixle-be.herokuapp.com/audio/today")
            .then((response) => response.json())
            .then((data) => setTodaysTrack(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <main>
            <NavBar
                user={userDetails}
                trigger={popupBtn}
                setTrigger={setPopupBtn}
            />
            <AboutPopUp trigger={popupBtn} setTrigger={setPopupBtn} />
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<MixerWrapper todaysTrack={todaysTrack} />}
                />
                <Route
                    path="/audio"
                    element={<Mixes todaysTrack={todaysTrack} />}
                />
                <Route
                    path="/register"
                    element={
                        <SignUp
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Login
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                        />
                    }
                />
            </Routes>
        </main>
    );
}

export default App;
