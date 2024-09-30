import React, { useState } from "react"; // Corrected import statement
import { useNavigate } from "react-router-dom"; // Corrected to 'react-router-dom'

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        password: ""
    });
    
    const navigate = useNavigate();

    // This function will update the state properties.
    function updateForm(value) {
        // Fixed the setForm syntax to use parentheses
        return setForm(prev => {
            return { ...prev, ...value }; // Use parentheses to spread the previous state
        });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form }; // Use spread operator to get form data

        // Fetch call to send data to the server
        await fetch("http://localhost:3000/user/signup", { // Fixed fetch syntax
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            window.alert(error); // Alert if there's an error
            return;
        });

        // Clear the form and navigate after successful signup
        setForm({ name: "", password: "" });
        navigate("/"); // Navigate to home or another route
    }

    return (
        <form onSubmit={onSubmit}>
            <input 
                type="text" 
                placeholder="Name" 
                value={form.name} 
                onChange={(e) => updateForm({ name: e.target.value })} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={(e) => updateForm({ password: e.target.value })} 
            />
            <button type="submit">Register</button>
        </form>
    );
}
