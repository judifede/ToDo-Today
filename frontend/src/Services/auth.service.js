import { auth } from './config'

export const login = async (loginData) => {
  const { data } = await auth.post('/login', loginData)
  console.log(data);
  
  return data
}

export const register = async (userData) => {
  const { data } = await auth.post('/register', userData)
  return data
}

