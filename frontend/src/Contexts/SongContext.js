import { useState, useEffect, createContext, useContext } from "react";

const API = process.env.REACT_APP_API_URL;
const TrackContext = createContext();

const useTrack = () => {
    return useContext(TrackContext);
}

const TrackProvider = ({ children }) => {
    const [todaysTrack, setTodaysTrack] = useState("");

    useEffect(() => {
        if (!todaysTrack) {
            fetch(`${API}/audio/today`)
                .then((response) => response.json())
                .then((data) => {
                    setTodaysTrack(data); 
                })
                .catch((err) => console.log(err));
        }
    }, []);

    return (
        <TrackContext.Provider value={[todaysTrack, setTodaysTrack]}>
            {children}
        </TrackContext.Provider>
    )
};

export {TrackProvider, useTrack};
