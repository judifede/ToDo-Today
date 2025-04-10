import axios from 'axios'

const BASE_URL_API = "http://localhost:5000/api"
const BASE_URL_AUTH = "http://localhost:5000/auth"

const api = axios.create({
  baseURL: BASE_URL_API
})

const auth = axios.create({
  baseURL: BASE_URL_AUTH
})

export {api, auth}