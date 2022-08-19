// DEPENDENCIES
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import jwtDecode from "./utils/jwtDecode";

// COMPONENTS
import SignUp from "./Components/Nav&Login/signUp";
import { MixerWrapper } from "./Components/mixersplashwrapper.js";
import { AudioPlayer } from "./Components/AudioPlayer/AudioPlayer";
import Loading from "./Components/Loading";
import Login from "./Components/Nav&Login/login";
import NavBar from "./Components/Nav&Login/navBar";
import AboutPopUp from "./Components/Nav&Login/AboutPopUp";
import Verification from "./Components/Nav&Login/Verification";

const API = process.env.REACT_APP_API_URL;

function App() {
    const UserContext = createContext();

    const [popupBtn, setPopupBtn] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: "",
        user_id: "",
        accessToken: "",
    });
    const [todaysTrack, setTodaysTrack] = useState("");
    const [loading, setLoading] = useState(true);

    let navigate = useNavigate();

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

    useEffect(() => {
        if (localStorage.getItem("active") && !userDetails.accessToken) {
            fetch(`${API}/user/refresh_token`, {
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                credentials: "include",
            })
                .then((response) => response.json())
                .then((tokens) => {
                    // DECODE
                    let decodedUser = jwtDecode(tokens.accessToken);

                    // SET USER INFO IN STATE
                    setUserDetails({
                        username: decodedUser.username,
                        user_id: decodedUser.user_id,
                        accessToken: tokens.accessToken,
                    });
                })
                .catch((error) => {
                    return navigate("/login");
                });
        }
    }, []);

    return (
        <UserContext.Provider value={userDetails}>
            <main>
                <NavBar
                    user={userDetails}
                    setUserDetails={setUserDetails}
                    trigger={popupBtn}
                    setTrigger={setPopupBtn}
                />
                <AboutPopUp trigger={popupBtn} setTrigger={setPopupBtn} />
                {!loading ? (
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                <MixerWrapper
                                    todaysTrack={todaysTrack}
                                    userDetails={userDetails}
                                />
                            }
                        />
                        <Route
                            path="/audio"
                            element={
                                <AudioPlayer
                                    todaysTrack={todaysTrack}
                                    mixes={true}
                                    userDetails={userDetails}
                                />
                            }
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
                        <Route path="/verify/:id" element={<Verification />} />
                    </Routes>
                ) : (
                    <Loading />
                )}
            </main>
        </UserContext.Provider>
    );
}

export default App;
