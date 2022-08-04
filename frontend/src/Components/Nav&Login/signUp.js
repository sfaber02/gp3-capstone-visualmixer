import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/SignUp.css";

const API = process.env.REACT_APP_API_URL;

function SignUp({ userDetails, setUserDetails }) {
    let navigate = useNavigate();

    //State to store current inputs
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    //If user is already logged in redirect to '/'
    useEffect(() => {
        if (userDetails.user_id) {
            navigate("/");
        }
    }, []);

    const handleChange = (event) => {
        setUser({ ...user, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API}/user/register`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const content = await response.json();

            if (content.error) {
                window.alert(content.error);
                setUser({ ...user, email: "" });
            } else {
                localStorage.setItem(
                    "user_id",
                    JSON.stringify(content.userInfo.user_id)
                );
                localStorage.setItem(
                    "username",
                    JSON.stringify(content.userInfo.username)
                );
                setUserDetails({
                    username: content.userInfo.username,
                    user_id: content.userInfo.user_id,
                });
                return navigate("/");
            }
        } catch (error) {
            return error;
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
                <h3>Register for Mixle!</h3>
                <div>
                    <i className="fas fa-user"></i>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        autoComplete="off"
                        onChange={handleChange}
                        value={user.username}
                        required
                    />
                </div>
                <div>
                    <i className="fas fa-at"></i>
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
                    <i className="fas fa-lock"></i>
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
                <input type="submit" value="SignUp" />
                <Link to={`/login`}>
                    <input type={"button"} value="Login" />
                </Link>
            </form>
        </div>
    );
}

export default SignUp;
