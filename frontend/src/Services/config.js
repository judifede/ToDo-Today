import axios from 'axios'


const BASE_URL = "https://retoolapi.dev/Cmucks"

const api = axios.create({
  baseURL: BASE_URL
})

export default api