import axios from "axios";

const baseAxios = axios.create({
    baseURL: 'http://localhost:8080/api/user',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    },
})

export const adminAxios = axios.create({
    baseURL: 'http://localhost:8080/api/admin',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    },
})

export default baseAxios;