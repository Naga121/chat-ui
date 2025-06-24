import { useSelector } from "react-redux";
import * as format from "../../custom-formats/format";
import LoginIcons from "../../static-data/costant";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../api-calls/api-header";

function Header({socket}) {
    const { user } = useSelector(state => state.userReducer);
    const navigate = useNavigate();

    const handleSocialIcons = (type) => { 
        if (type === "logout") {
            localStorage.removeItem('token');
            window.location.href = `${SERVER_URL}/api/gauth/logout`;
            socket.emit('user-offline',   (user._id));
        }
    };

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Quick Chat
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{format.firstLetterUpper(user)}</div>
                {(user?.profilePic) ? (<img src={user?.profilePic} alt="profile-pic" className="logged-user-profile-pic" onClick={() => navigate('/profile')} />) : (<div className="logged-user-profile-pic" onClick={() => navigate('/profile')}>{format.shortNameUpper(user)}</div>)}
                {LoginIcons.map((item, index) => (item.name.includes('logout') &&
                    <button key={index} type="button" className={item.name.includes('logout') ? "logout-btn" : "social-btn-icon"} onClick={() => handleSocialIcons(item.name)}
                        style={{ cursor: 'pointer' }}> <i className={`fa fa-brands ${item.icon}`}></i>
                    </button>)
                )}
            </div>
        </div>
    )
}
export default Header;