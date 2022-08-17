import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Verification() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userVerificationPost = async (id) => {
            let response = await fetch(`${API}/user/verify/${id}`, {
                method: "PATCH",
            });
        };
        try {
            userVerificationPost(id);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }, []);
    return;
}
