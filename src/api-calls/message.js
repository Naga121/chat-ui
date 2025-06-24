import { axiosInstance, SERVER_URL } from "./api-header";

export const newMessageApi = async (obj) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/msg/new-msg`, obj);
        return response.data;
    } catch (error) {
        return error
    }
}

export const getAllMessagesApi = async (chatId) => {
    try {
        const response = await axiosInstance.get(`${SERVER_URL}/api/msg/get-all-msgs/${chatId}`);
        return response.data;
    } catch (error) {
        return error
    }
}

// Clear unread messages
export const clearUnredChats = async (chatId) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/msg/clear-unread-msg`, { chatId });
        return response.data;
    } catch (error) {
        return error
    }
}