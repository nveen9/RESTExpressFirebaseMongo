import React from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();
    const handleClick = async (event) => {
        await axios.post('http://localhost:3000/signout')
            .then(response => {
                // Handle successful response from backend here
                alert(response.data.message);
                console.log(response.data);
                navigate("/login");
            })
            .catch(error => {
                // Handle error here
                console.log(error.response.data);
                alert(error.response.data.message);
            });
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Welcome to Home Page</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleClick}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
