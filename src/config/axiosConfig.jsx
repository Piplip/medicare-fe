import axios from "axios";

const baseAxios = axios.create({
    baseURL: 'http://localhost:8080/api/user',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
})

export default baseAxios