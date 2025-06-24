import { axiosInstance, SERVER_URL } from "./api-header";

export const getLoggedUser = async () => {
    try {
        const responce = await axiosInstance.get(`${SERVER_URL}/api/user/current-user`);
        return responce.data;
    } catch (error) {
        return error
    }
}

export const getAllUser = async () => {
    try {
        const responce = await axiosInstance.get(`${SERVER_URL}/api/user/all-users`);
        return responce.data;
    } catch (error) {
        return error
    }
}

export const uploadImage = async (file) => {
    try {
        const responce = await axiosInstance.post(`${SERVER_URL}/api/user/upload-image`, { image: file });
        return responce.data;
    } catch (error) {
        return error
    }
};