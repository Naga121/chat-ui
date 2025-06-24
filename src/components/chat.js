import { useDispatch, useSelector } from "react-redux";
import * as format from "../custom-formats/format";
import { hideLoader, showLoader } from "../redux/loaderSilce";
import { useEffect, useState } from "react";
import * as messageApi from "../api-calls/message";
import moment from "moment/moment";
import store from "../redux/store";
import { setAllChats } from "../redux/userSlice";
import EmojiPicker from "emoji-picker-react";
import fileValidation from "../custom-formats/file-validation";
import { data } from "react-router-dom";



function ChatArea({ socket }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [allMessages, setAllMssages] = useState([]);
    const [isTyping, setTyping] = useState(false);
    const [showEmoji, setEmoji] = useState(false);
    const [isTypingData, setTypingData] = useState(null);

    const { user, selectedChat: chat, allChats } = useSelector(state => state.userReducer || {});
    const selectedUser = chat?.members.find(menubar => menubar._id !== user._id);

    const sendMessage = async (image) => {
        try {
            const messageObj = {
                chatId: chat._id,
                sender: user._id,
                text: message,
                image: image
            }
            socket.emit('send-msg', {
                ...messageObj,
                members: selectedUser.members.map(menubar => menubar._id),
                read: false,
                createdAt: moment().format('YYYY-MM-DD hh:mm:ss')
            });
            const response = await messageApi.newMessageApi(messageObj);
            if (response.success) {
                setAllMssages(prev => [...prev, response.data]);
                setMessage('');
                setEmoji(false);
            } else {
                console.log(response);
            }
        } catch (error) {
        }
    }

    const getMessages = async () => {
        try {
            dispatch(showLoader());
            const responce = await messageApi.getAllMessagesApi(chat._id);
            dispatch(hideLoader());
            if (responce.success) {
                setAllMssages(responce.data);
            } else {
                dispatch(hideLoader());
            }
        } catch (error) {
            dispatch(hideLoader());
        }
    }

    const clearUnredMessages = async () => {
        try {
            socket.emit('clear-unread-msg', {
                chatId: chat._id,
                members: chat.members.map(menubar => menubar._id)
            });
            const responce = await messageApi.clearUnredChats(chat._id);

            if (responce.success) {
                allChats.map(chat => {
                    if (chat._id === chat._id) {
                        return responce.data;
                    }
                    return chat;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validatedFile = fileValidation(file);
        if (!validatedFile) return; // Stop if invalid!

        const reader = new FileReader();
        reader.readAsDataURL(validatedFile);
        reader.onloadend = () => {
            sendMessage(reader.result)
        };
    };

    useEffect(() => {
        getMessages();

        if (chat?.lastMessage?.sender !== user._id) {
            clearUnredMessages();
        }

        socket.off('receive-msg').on('receive-msg', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            if (selectedChat._id === message.chatId) {
                setAllMssages(preMsg => [...preMsg, message]);
            }
            if (selectedChat._id === message.chatId && message.sender !== user._id) {
                clearUnredMessages();
            }
        });

        socket.on('msg-count-clear', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            const allChats = store.getState().userReducer.allChats;

            if (selectedChat._id === message.chatId) {
                // Update unread message count
                const updateChat = allChats.map((chat) => {
                    if (chat._id === message._id) {
                        return { ...chat, unreadMessageCount: 0 }
                    }
                    return updateChat;
                });
                dispatch(setAllChats(updateChat));

                //Update read property  in message object 
                setAllMssages(preMsg => {
                    return preMsg.map(msg => {
                        return { ...msg, read: true }
                    })
                });
            }

        });

        socket.on('started-typing', (message) => {
            setTypingData(message)
            if (chat._id === message.chatId && message.sender !== user._id) {
                setTyping(true);
                setTimeout(() => {
                    setTyping(false);
                }, 2000);
            }
        });

    }, [chat]);


    useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [allChats, isTyping])

    return (
        <>
            {chat &&
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {format.firstLetterUpper(selectedUser)}
                    </div>
                    <div className="main-chat-area" id="main-chat-area">
                        {allMessages.map((msg, index) => {
                            const isSenderMessage = msg.sender === user._id;
                            return <div className="message-container" style={isSenderMessage ? { justifyContent: "end" } : { justifyContent: "start" }} key={index}>
                                <div>
                                    <div className={isSenderMessage ? "send-message" : "received-message"}>
                                        <div>{msg.text}</div>
                                        <div>
                                            {msg.image && <img src={msg.image} alt="image" height={20} width={20} />}
                                        </div>
                                    </div>
                                    <div className="message-timestamp" style={isSenderMessage ? { float: "right" } : { float: "left" }}>
                                        {format.formatTime(msg.createdAt)} {isSenderMessage && msg.read && <i className="fa fa-circle-check" aria-hidden="true" style={{ color: "#e74c3c" }}></i>}
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="typing-indicator">{isTyping && selectedChat?.members.map((menubar)=> menubar._id).includes(message?.sender) && <i>typing...</i>}</div>
                    </div>
                    {showEmoji && (
                        <div className="" style={{ width: '100%', display: 'flex', padding: '0px 20px', justifyContent: 'right' }}>
                            <EmojiPicker style={{ width: '300px', height: '400px' }} onEmojiClick={(e) => setMessage(message + e.emoji)}></EmojiPicker>
                        </div>
                    )}
                    <div className="send-message-div">
                        <input type="text" className="send-message-input" placeholder="Type a message"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                socket.emit('typing', {
                                    chatId: chat._id,
                                    members: chat.members.map(member => member._id),
                                    sender: user._id
                                })
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && message.trim()) {
                                    sendMessage();
                                }
                            }}
                        />
                        {
                            message && <label for="file">
                                <i className="fa fa-picture-o send-image-btn" aria-hidden="true" ></i>
                                <input type="file" id="file" style={{ display: 'none' }} accept="image/png, image/jpeg,image/jpg, image/gif" onChange={() => sendImage('')} />
                            </label>
                        }
                        {
                            showEmoji && <i className="fa fa-smile-o send-emoji-btn" aria-hidden="true" onClick={() => setEmoji(!showEmoji)}></i>
                        }
                        {
                            message && <i className="fa fa-paper-plane send-message-btn" aria-hidden="true" onClick={() => message.trim() && sendMessage()}></i>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default ChatArea;