import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// TODO: wire up to real auth API (POST /auth/login, POST /auth/signup, /auth/forgot-password)
function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password || (mode === "signup" && !form.name)) {
            setError("Please fill in all fields.");
            return;
        }

        // Mock auth — replace with a real API call.
        // Signup always creates a plain Employee account; no role selection at signup.
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("userRole", "Admin");
        localStorage.setItem("userName", form.name || "Admin User");
        localStorage.setItem("orgName", "AssetFlow");
        navigate("/home", { replace: true });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <p className="login-brand">AssetFlow</p>
                <p className="login-tagline">Enterprise Asset &amp; Resource Management</p>

                <div className="login-toggle">
                    <button
                        className={mode === "login" ? "toggle-btn active" : "toggle-btn"}
                        onClick={() => setMode("login")}
                        type="button"
                    >
                        Log in
                    </button>
                    <button
                        className={mode === "signup" ? "toggle-btn active" : "toggle-btn"}
                        onClick={() => setMode("signup")}
                        type="button"
                    >
                        Sign up
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <div className="login-field">
                            <label>Full Name</label>
                            <input name="name" type="text" placeholder="Jane Doe" value={form.name} onChange={handleChange} />
                        </div>
                    )}

                    <div className="login-field">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="login-field">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    {mode === "login" && (
                        <button type="button" className="login-forgot">Forgot password?</button>
                    )}

                    <button type="submit" className="login-submit">
                        {mode === "login" ? "Log In" : "Create Employee Account"}
                    </button>

                    {mode === "signup" && (
                        <p className="login-note">
                            Signup only creates a standard Employee account. An Admin promotes select
                            employees to Department Head or Asset Manager from Organization Setup.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;