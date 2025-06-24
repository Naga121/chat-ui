import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import * as userApi from "./../api-calls/user";
import * as chatApi from "./../api-calls/chat";

import { showLoader, hideLoader } from "../redux/loaderSilce";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";


function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);

    // === Helper: Load all user-related data ===
    const initializeUserSession = useCallback(async () => {
        try {
            dispatch(showLoader());

            // 1 Get logged-in user
            const userResponse = await userApi.getLoggedUser();
            if (!userResponse.success) throw new Error();
            dispatch(setUser(userResponse.data));

            // 2️ Get all users
            const usersResponse = await userApi.getAllUser();
            if (!usersResponse.success) throw new Error();
            dispatch(setAllUsers(usersResponse.data));

            // 3️ Get chats
            const chatsResponse = await chatApi.getAllChats();
            if (!chatsResponse.success) throw new Error();
            dispatch(setAllChats(chatsResponse.data));

        } catch (error) {
            // If anything fails → force logout
            navigate("/login");
        } finally {
            dispatch(hideLoader());
            setLoading(false);
        }

    }, [dispatch,navigate]);

    // === Run on mount ===
    useEffect(() => {
        token ?  initializeUserSession() : navigate("/login");
    }, [navigate, token, initializeUserSession]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <h3>Loading your account...</h3>
            </div>
        );
    }

    return children;
}
export default ProtectedRoute;