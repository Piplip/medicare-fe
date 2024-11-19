import axios from "axios";

const baseAxios = axios.create({
    baseURL: 'http://localhost:8080/api/user',
    timeout: 60000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})

export const adminAxios = axios.create({
    baseURL: 'http://localhost:8080/api/admin',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})

export const staffAxios = axios.create({
    baseURL: 'http://localhost:8080/api/staff',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})

export const webSocketAxios = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})

export default baseAxios;