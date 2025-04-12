import { auth } from './config'

export const login = async (loginData) => {
  try {
    const { data } = await auth.post('/login', loginData)

    return data
  } catch (err) {

    return { error: err.response.data.error }

  }
}

export const register = async (userData) => {
  try {
    const { data } = await auth.post('/register', userData)

    return data
  } catch (err) {

    return { error: err.response.data.error }

  }
}

