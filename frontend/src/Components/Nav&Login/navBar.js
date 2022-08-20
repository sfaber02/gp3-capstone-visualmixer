import Dropdown from "./Dropdown";
import "../../Styles/Nav.css";

export default function NavBar({ trigger, setTrigger}) {
    const handleIconClick = () => {
        setTrigger(!trigger);
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light"
            style={{
                backgroundImage: "linear-gradient(to right, #211898 , #4C3BAC)",
            }}
        >
            <button className="iconBtn" onClick={handleIconClick}>
                <i className="fa-solid fa-circle-info fa-xl"></i>
            </button>
            <a className="navbar-brand" href="/">
                <h1>MIXLE</h1>
            </a>
            <Dropdown />
        </nav>
    );
}
