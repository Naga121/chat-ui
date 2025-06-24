import { axiosInstance, SERVER_URL } from "./api-header"

// Get all chats
export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get(`${SERVER_URL}/api/chat/get-all-chat`);
        return response.data;
    } catch (error) {
        return error
    }
};

// Create new chat
export const createNewChat = async (members) => {
    try {
        console.log(members);

        // const response = await axiosInstance.post(`${SERVER_URL}/api/chat/create-chat`, {members});
        // return response.data;
    } catch (error) {
        return error
    }
}

// Friend request
export const friendRequest = async (userId = "") => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/chat/friend-request`, { userId });
        return response.data;
    } catch (error) {
        return error
    }
}


// Friend Accept/Reject Request
export const acceptRejectRequest = async (members) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/chat/friend-request/respond`, { members });
        return response.data;
    } catch (error) {
        return error
    }
} 
