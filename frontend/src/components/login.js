import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Corrected to 'react-router-dom'
export default function Login() {
    const [form, setForm] = useState({
        name: "",
        password: ""
    })
    const navigate = useNavigate();

    function updateForm(value) {
        return setForm(prev => {
            return {...prev, ...value};
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
    
        const newPerson = { ...form };
    
        const response = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            window.alert("Login failed: " + error);
            return;
        });
    
        if (!response.ok) {
            window.alert("Invalid credentials, please try again!");
            return;
        }
    
        const data = await response.json();
        const { token, name } = data;
    
        // Show success alert
        window.alert(`Login successful! Welcome, ${name}`);
    
        // Save JWT and name to localStorage
        localStorage.setItem("JWT", token);
        localStorage.setItem("name", name);
    
        // Clear the form
        setForm({ name: "", password: "" });
    
        // Navigate to home
        navigate("/");
    }
    
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={form.name}
                    onChange={(e) => updateForm({name: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                    type="text"
                    className="form-control"
                    id="password"
                    value={form.password}
                    onChange={(e) => updateForm({password: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <input
                    type="submit"
                    value="Login"
                    className="btn btn-primary"/>
                </div>
            </form>
        </div>
    );
}