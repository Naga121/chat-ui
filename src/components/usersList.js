import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";


import * as chatApi from "./../api-calls/chat";
import * as format from "./../custom-formats/format";
import * as userSlice from "./../redux/userSlice";

import { hideLoader, showLoader } from "./../redux/loaderSilce";
import store from "./../redux/store";


function UsersList({ searchKey = "", socket, isOnline }) {
    const { user: currentUser = {}, allUsers = [], allChats = [], selectedChat = {} } = useSelector((state) => state.userReducer || {});

    const dispatch = useDispatch();

    // GOOD pattern for filtering users OR showing allChats
    // If search is empty → return all chats.
    // If searching → return matching users.
    const filteredList = useMemo(() => {
        if (!searchKey?.trim()) {
            return allUsers;
        } else {
            return allUsers.filter((user) => {
                const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
                return fullName.includes(searchKey.toLowerCase());
            });
        }
    }, [searchKey, allUsers]);

    // 
    const renderProfilePic = (user) => {
        const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
        const style = isOnline.includes(user._id) ? { border: "3px solid #82e0aa" } : {};
        return user.profilePic ? (<img src={user.profilePic} alt="Profile" className="user-profile-image" style={style} />) : (<span className="user-initials">{initials}</span>);
    };

    // Start a new chat with a user.
    const chatRequest = useCallback(async (userId) => {
        try {
            dispatch(showLoader());
            const response = await chatApi.friendRequest(userId);
            dispatch(hideLoader());
            console.log(response);
            
            // if (response.success) {
            //     dispatch(userSlice.setAllChats([response.data, ...allChats]));
            //     dispatch(userSlice.setSelectedChat(response.data));
            // }
        } catch (error) {
            dispatch(hideLoader());
        }
    }, [dispatch, currentUser._id]);

    // Open an existing chat.
    const openChat = useCallback((userId) => {
        const chat = allChats.find((chat) => chat.members.some((m) => m._id === userId));
        console.log(chat);
        if (chat) {
            dispatch(userSlice.setSelectedChat(chat));
        }
    }, [allChats, dispatch]);

    // Get preview of last message.
    const getLastMessageText = (userId) => {
        const chat = allChats.find((chat) => chat.members.some((m) => m._id === userId));
        if (!chat?.lastMessage) return "";
        const prefix = chat.lastMessage.sender === currentUser._id ? "You: " : "";
        return prefix + chat.lastMessage.text?.slice(0, 30);
    };

    // Get last message timestamp.
    const getLastMessageTime = (userId) => {
        const chat = allChats.find((chat) => chat.members.some((m) => m._id === userId));
        return chat?.lastMessage ? format.dateTimeFormat(chat, "hh:mm A") : "";
    };

    // Get unread message count.
    const getUnreadMessageCount = (userId) => {
        const chat = allChats.find((chat) => chat.members.some((m) => m._id === userId));
        if (chat?.unreadMessageCount && chat.lastMessage?.sender !== currentUser._id) {
            return (<div className="unread-message-counter">  {chat.unreadMessageCount} </div>);
        }
        return null;
    }

    // Check if the given user is the selected chat.
    const isSelectedUser = (user) => {
        return selectedChat?.members?.some((membar) => membar._id === user._id);
    };

    // Listen for new messages via socket.
    useEffect(() => {
        if (!socket) return;
        socket.off("set-message-count").on("set-message-count", (message) => {
            const { selectedChat, allChats } = store.getState().userReducer;
            let updatedChats = [...allChats];
            if (selectedChat?._id !== message.chatId) {
                updatedChats = updatedChats.map((chat) =>
                    chat._id === message.chatId ? { ...chat, unreadMessageCount: (chat.unreadMessageCount || 0) + 1, lastMessage: message, } : chat
                );
                console.log(updatedChats);
            }
            const latestChat = updatedChats.find((chat) => chat._id === message.chatId);
            const otherChats = updatedChats.filter((chat) => chat._id !== message.chatId);
            dispatch(userSlice.setAllChats([latestChat, ...otherChats]));
        });
        return () => socket.off("set-message-count");
    }, [dispatch, socket]);


    // Render each user or chat.
    return filteredList.map((item) => {
        const user = item.members ? item.members.find((m) => m._id !== currentUser._id) : item;
        const alreadyInChat = allChats.some((chat) => chat.members.some((m) => m._id === user._id));
        return (
            <div key={user?._id} className="user-search-filter" onClick={() => openChat(user._id)}>
                <div className={isSelectedUser(user) ? "selected-user" : "filtered-user"}>
                    <div className="filter-user-display">
                        {/* {user.profilePic ?
                            (<img src={user.profilePic} alt="Profile" className="user-profile-image" style={isOnline ? { border: "3px solid #82e0aa" } : {}} />) :
                            (<div className={isSelectedUser(user) ? "user-selected-avatar" : "user-default-avatar"}
                                style={isOnline ? { border: "3px solid #82e0aa" } : {}}> {user.firstname?.[0].toUpperCase()}  {user.lastname?.[0].toUpperCase()}
                            </div>)
                        } */}
                        <div className={isSelectedUser(user) ? "user-selected-avatar" : "user-default-avatar"}> {renderProfilePic(user)} </div>
                        <div className="filter-user-details">
                            <div className="user-display-name"> {format.firstLetterUpper(user)} </div>
                            <div className="user-display-email"> {getLastMessageText(user._id) || user.email} </div>
                        </div>
                        <div className="user-meta">
                            {getUnreadMessageCount(user._id)}  <div className="last-message-timestamp"> {getLastMessageTime(user._id)} </div>
                        </div>
                        {!alreadyInChat && (
                            <div className="user-start-chat">
                                <button type="button" className="user-start-chat-btn fa fa-comments" onClick={(e) => chatRequest(user._id, e)} aria-label={`Start chat with ${user.firstname}`} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    })
}
export default UsersList;