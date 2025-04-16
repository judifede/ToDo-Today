import axios from 'axios'

const isDevelopment = import.meta.env.VITE_ENV  === 'development'

const BASE_URL_API_DEV = "http://localhost:5000/api"
const BASE_URL_API_PROD = "https://todo-today-lorl.onrender.com/api" 
const BASE_URL_AUTH_DEV = "http://localhost:5000/auth"
const BASE_URL_AUTH_PROD = "https://todo-today-lorl.onrender.com/auth"

const api = axios.create({
  baseURL: isDevelopment ? BASE_URL_API_DEV : BASE_URL_API_PROD
})

const auth = axios.create({
  baseURL: isDevelopment ? BASE_URL_AUTH_DEV : BASE_URL_AUTH_PROD
})

export { api, auth }