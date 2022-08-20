// DEPENDENCIES ll
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import jwtDecode from "../../utils/jwtDecode";
import "../../Styles/Login.css";

const API = process.env.REACT_APP_API_URL;

function Login() {
    let navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [userDetails, setUserDetails] = useUser();

    // redirect user from login if they are already logged in ===> CHECK TOKEN?
    useEffect(() => {
        if (userDetails.accessToken) {
            navigate("/");
        }
    }, []);

    // handleChange for input elements
    const handleChange = (event) => {
        setUser({ ...user, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            async function loginPostFetch(user) {
                const response = await fetch(`${API}/user/login`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                    credentials: "include",
                });

                const data = await response.json();
                return data;
            }
            const data = await loginPostFetch(user);

            // conditionls check fetch data if incorrect password or email
            if (!data.error) {
                // DECODE
                let decodedUser = jwtDecode(data.accessToken);

                // SET USER INFO IN STATE
                setUserDetails({
                    username: decodedUser.username,
                    user_id: decodedUser.user_id,
                    accessToken: data.accessToken,
                });
                localStorage.setItem("active", true);
                return navigate("/");
            } else if (data.error === "password") {
                setUser({ ...user, password: "" });
                alert("Incorrect Password Please Try Again");
            } else if (data.error === "email") {
                setUser({ ...user, email: "" });
                alert("Incorrect Email Please Try Again");
            }
        } catch (error) {
            return error;
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h3>Login into Mixle!</h3>
                <div>
                    <label htmlFor="email">
                        <i className="fas fa-at"></i>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        autoComplete="off"
                        onChange={handleChange}
                        value={user.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">
                        <i className="fas fa-lock"></i>
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        id="password"
                        autoComplete="off"
                        onChange={handleChange}
                        value={user.password}
                        required
                    />
                </div>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}

export default Login;
