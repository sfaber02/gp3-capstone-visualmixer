import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode";

const API = process.env.REACT_APP_API_URL;


const UserContext = createContext();
const UserUpdateContext = createContext();

const useUser = () => {
    return [useContext(UserContext), useContext(UserUpdateContext)];
};



const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
        username: "",
        user_id: "",
        accessToken: "",
    });

     let navigate = useNavigate();

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
            <UserUpdateContext.Provider value={setUserDetails}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
};

export {  UserProvider, useUser };
