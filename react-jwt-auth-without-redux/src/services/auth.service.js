import axios from 'axios';

const API_URL = "http://localhost:8000/api/auth/";

class AuthService {

    login(username, password) {
        var data = { username, password };
        return axios
                .post(API_URL + "signin", data)
                .then(response => {
                    if(response.data.accessToken) {
                        localStorage.setItem("user", JSON.stringify(response.data));
                    }

                    return response.data;
                });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        var data = { username, email, password };
        return axios.post(API_URL + "signup", data)
                .then(response => {
                    console.log('Registration OK');
                });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
    
}

export default new AuthService();