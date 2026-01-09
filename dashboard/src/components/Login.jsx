import React from "react";
import { useEffect } from "react";

import "../assets/login.css";

import API from "../api";

function Login() {

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await API.login({
            email: formData.get("email") || null,
            passwrod: formData.get("password") || null
        });

        console.log(response);
    };

    useEffect(() => {
        console.log("LOGIN INIT")
    });


    return (
        <>
            <div className="login-card">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Logo" className="logo" />
                <h3>Sign In</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter email" />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter password" />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                    </div>
                    <a href="#" className="small text-decoration-none text-primary">Forgot password?</a>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <p className="form-text mt-3">Don’t have an account? <a href="#">Register</a></p>
                </form>
            </div>

        </>
    );
};

export default Login;