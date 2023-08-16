import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-type": "application/json"
    }
});

// Add a request interceptor
http.interceptors.request.use(
    function (config: any) {
        // Do something before request is sent
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error: any) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
http.interceptors.response.use(
    function (response: any) {
        // Do something with response data
        return response.data;
    },
    function (error: any) {
        // Do something with response error
        return Promise.reject(error);
    }
);

export default http;