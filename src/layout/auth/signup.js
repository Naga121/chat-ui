import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../../api-calls/auth";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSilce"
import LoginIcons from "../../static-data/costant";
import { SERVER_URL } from "../../api-calls/api-header";


function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState({ firstname: "", lastname: "", email: "", password: "" });

    async function onFormSubmit(event) {
        event.preventDefault();
        let response = null;
        try {
            dispatch(showLoader());
            response = await authApi.signupApi(user);
            console.log(response);
            dispatch(hideLoader());
            if (response.success) {
                navigate('/verify-email')
            }
        } catch (error) {
            dispatch(hideLoader());
        }
    }

    const handleSocialIcons = (type) => {
        if (type === "google") {
            window.location.href =`${SERVER_URL}/api/gauth/google`
        }

    };

    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>
                <div className="form">
                    <form onSubmit={onFormSubmit}>
                        <div className="column">
                            <input type="text" placeholder="First Name" value={user.firstname} onChange={(e) => setUser({ ...user, firstname: e.target.value })} />
                            <input type="text" placeholder="Last Name" value={user.lastname} onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
                        </div>
                        <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                        <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        <button>Sign Up</button>
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
                    <span>Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Signup;