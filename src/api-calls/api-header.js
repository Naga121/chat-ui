import axios from "axios";

export const SERVER_URL = `http://localhost:8000`;

export const axiosInstance = axios.create({ 
    headers: {
        Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});