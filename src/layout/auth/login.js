import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as authApi from "../../api-calls/auth";
import { showLoader, hideLoader } from "../../redux/loaderSilce";
import LoginIcons from "../../static-data/costant";
import { SERVER_URL } from "../../api-calls/api-header";


function useForm(initialState) {
    const [values, setValues] = React.useState(initialState);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };
    const resetForm = () => setValues(initialState);
    return [values, handleChange, resetForm];

}


function Login() {

    // Manage form state using our custom useForm hook
    const [credentials, handleInputChange, resetForm] = useForm({ email: "", password: "" });
    const [error, setError] = React.useState(null);
    const [resendToken, setResendToken] = React.useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validate the form inputs.
    const validateInputs = () => {
        const { email, password } = credentials;

        // Check if email is empty.
        if (!email.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     // Simple email regex pattern.
        if (!emailRegex.test(email)) return "Invalid email format.";

        // Check if password is empty.
        // if (!password) return "Password is required.";
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;   // Password rules: min 8 characters, one lowercase, one uppercase, one number and one symbol.
        // if (!passwordRegex.test(password)) {
        //     return "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";
        // }
        return null
    }

    // Handles form submission after validating the inputs.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Run validations.
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        dispatch(showLoader());
        try {
            const response = await authApi.signinApi(credentials);
            const { success, token, resend, message } = response;
            if (success) {
                localStorage.setItem('token', token);
                resetForm(); // Clear the form inputs after successful login.
                navigate("/dashboard");
            } else {
                setError(message);
                if (resend) setResendToken(true);
            }
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again.");
        } finally {
            dispatch(hideLoader());
        }
    };

    // Manages resending the verification email
    const handleResendToken = async () => {
        try {
            const response = await authApi.resendEmailApi(credentials);
            console.log("Verification email resent!", response);
            navigate("/verify-email");
        } catch (error) {
            console.error("Resend verification error:", error);
            setError("Error sending verification email. Please try again later.");
        }
    };

    const  handleSocialIcons =(type)=>{
        console.log(type);
        if (type === "google") {
           window.location.href =`${SERVER_URL}/api/gauth/google`;
        }
    };
    
    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1> <i className="fa fa-user"></i> Login</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" className="" placeholder="Email" value={credentials.email} onChange={handleInputChange} />
                        <input type="password" name="password" className="" placeholder="Password" value={credentials.password} onChange={handleInputChange} />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="btn">Login</button>
                        {resendToken && (
                            <button type="button" onClick={handleResendToken}>Resend Verification Email</button>
                        )}
                    </form>
                </div>
                <div className="socal-icons">
                    <h4 className="">Or</h4>
                    {LoginIcons.map((item, index) => (!item.name.includes('logout') &&
                        <button key={index} type="button" className="social-btn-icon" style={{ color: item.color, background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleSocialIcons(item.name)}> <i className={`fa-brands ${item.icon}`}></i>
                        </button>
                    ))}
                </div>
                <div className="card_terms">
                    <span>
                        Don't have an account yet? <Link to="/signup">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Login;