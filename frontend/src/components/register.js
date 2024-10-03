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
    
        const newPerson = { ...form };
    
        try {
            const response = await fetch("https://localhost:3000/user/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                window.alert(`Signup failed: ${errorMessage}`);
                return;
            }
    
            window.alert("Signup successful!");
    
            // Clear form and navigate if successful
            setForm({ name: "", password: "" });
            navigate("/");
        } catch (error) {
            window.alert(`Error: ${error.message}`);
        }
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
