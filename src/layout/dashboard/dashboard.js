import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import ChatArea from "./../dashboard/header";
import io from 'socket.io-client';
import * as authApi from "../../api-calls/auth";
import { SERVER_URL } from "../../api-calls/api-header";

const socket = io(SERVER_URL, {
    transports: ['websocket'],
    withCredentials: true
});

function Dashboard() {
    const { selectedChat, user } = useSelector(state => state.userReducer || {});

    const [isOnline, setOnline] = useState([]);

    const getGoogleUser = async () => {
        const response = await authApi.authUser();
        console.log(response);
    };

    socket.on("connect", () => {
        console.log(socket.id);
    });

    useEffect(() => {
        if (user) {
            socket.emit('join-room', user._id);
            socket.emit('user-login', user._id);
            socket.on('online-users', (onlineUsers) => {
                setOnline(onlineUsers)
            });
            socket.on('user-online', (onlineUsers) => {
                setOnline(onlineUsers)
            });

        }
        getGoogleUser();
    }, [user, isOnline]);

    return (
        <div className="home-page">
            <Header socket={socket} />
            <div className="main-content">
                <Sidebar socket={socket} isOnline={isOnline}></Sidebar>
                {selectedChat && <ChatArea socket={socket}></ChatArea>}
            </div>
        </div>
    )
}

export default Dashboard;