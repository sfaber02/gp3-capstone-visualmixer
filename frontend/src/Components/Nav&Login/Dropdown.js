import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";


/**
 *
 * @param {Object} user -  user object used to manipulate dropdown element
 * @returns JSX for dropdown element
 */

const API = process.env.REACT_APP_API_URL;

export default function Dropdown() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useUser();

    const handleSignOut = () => {
        setUserDetails({
            username: "",
            user_id: "",
            accessToken: "",
        });

        //FETCH
        const removeCookie = async () => {
            let removed = await fetch(`${API}/user/refresh_token`, {
                method: "DELETE",
                credentials: "include",
            });
        };
        removeCookie();
        localStorage.clear("active");


        return navigate("/");
    };

    if (userDetails.username) {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {userDetails.username + " "}
                </button>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuButton"
                >
                    <a className="dropdown-item" href="/mixes">
                        View Today's Mixes
                    </a>
                    <a className="dropdown-item" href="/mixer">
                        Make a Mix
                    </a>
                    <a className="dropdown-item" onClick={handleSignOut}>
                        Signout
                    </a>
                </div>
            </div>
        );
    } else {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    Welcome
                </button>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuButton"
                >
                    <a className="dropdown-item" href="/login">
                        Login
                    </a>
                    <a className="dropdown-item" href="/register">
                        Register
                    </a>
                </div>
            </div>
        );
    }
}
