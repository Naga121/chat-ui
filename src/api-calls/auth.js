import { axiosInstance, SERVER_URL } from "./api-header";


export const authUser = async () => {
    try {
        const response = await axiosInstance.get(`${SERVER_URL}/api/gauth/login/success`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return error
    }
}

export const signupApi = async (user) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/auth/signup`, user);
        return response.data;
    } catch (error) {
        return error
    }
}

export const verifyEmailApi = async (token) => {
    try {
        const response = await axiosInstance.get(`${SERVER_URL}/api/auth/verify-email?token=${token}`);
        return response.data;
    } catch (error) {
        return error
    }
}

export const resendEmailApi = async (email) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/auth/resend-verification`, email);
        return response.data;
    } catch (error) {
        return error
    }
}

export const signinApi = async (user) => {
    try {
        const response = await axiosInstance.post(`${SERVER_URL}/api/auth/login`, user);
        return response.data;
    } catch (error) {
        return error
    }
}