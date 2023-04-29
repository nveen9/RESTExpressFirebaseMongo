import React from 'react'
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
    const navigate = useNavigate();
    const handleClick = (event) => {
        navigate("/login");
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Welcome</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleClick}
                >
                    Login
                </button>
            </div>
        </div>
    )
}
