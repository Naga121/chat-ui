import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormat, firstLetterUpper, shortNameUpper } from "../../custom-formats/format";
import { uploadImage } from "../../api-calls/user";
import { showLoader, hideLoader } from "../../redux/loaderSilce";
import { setUser } from "../../redux/userSlice";
import fileValidation from "../../custom-formats/file-validation";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userReducer);

    const [image, setImage] = useState('');

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1️ Validate type & size (max 2 MB)
        const validatedFile = fileValidation(file);
        if (!validatedFile) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(validatedFile);
    };

    // Upload selected image to server
    const updateProfilePic = async () => {
        try {
            dispatch(showLoader());
            const response = await uploadImage(image);
            if (response.success) {
                dispatch(setUser(response.data))
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(hideLoader());
        }
    };

    // Initialize profile image from user data
    useEffect(() => {
        if (user?.profilePic) {
            setImage(user.profilePic);
        }
    }, [user]);

    return (
        <>
            <div className="profile-page-container">
                <div className="profile-pic-container">
                    {image ? (<img src={image} alt="Profile Pic" className="user-profile-pic-upload" />) : (shortNameUpper(user))}
                </div>
                <div className="profile-info-container">
                    <div className="user-profile-name">
                        <h1>{firstLetterUpper(user)}</h1>
                    </div>
                    <div>
                        <strong>Email: </strong> {user?.email}
                    </div>
                    <div>
                        <strong>Account Created: </strong>{dateTimeFormat(user, 'MMM DD, YYYY')}
                    </div>
                    <div className="select-profile-pic-container">
                        <input type="file" onChange={handleFileSelect} />
                        <button className="upload-image-btn" onClick={updateProfilePic}> Upload </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;