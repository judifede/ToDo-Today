import { useState } from 'react'
import PropTypes from 'prop-types'

import { EyeIcon, EyeSlashIcon } from '../assets/icons'
import { login, register } from '../Services/auth.service'

function Login({ setLoading }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPassVisible, setIsPassVisible] = useState(false)

  const onLogin = async () => {
    try {
      setLoading(true)

      const login_result = await login({ username, password })

      setLoading(false)
      onLocalStorage(login_result)
    } catch (err) {
      console.error(err)
    }
  }

  const onRegister = async () => {
    try {
      setLoading(true)

      const res = await register({
        username,
        password,
      })

      setLoading(false)
      onLocalStorage(res)
    } catch (err) {
      console.error(err)
    }
  }

  const onLocalStorage = async (res) => {
    if (res.error) {
      setErrorMessage(res.error)
      return
    }

    localStorage.setItem('token', res.token)
    window.location.reload()
  }

  return (
    <form className="flex flex-col w-full gap-5 mx-auto max-w-60">
      <div className="relative flex flex-col gap-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Usuario
        </label>
        <input
          type="text"
          onChange={(e) => {
            setUsername(e.target.value)
          }}
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Usuario"
          required
        />
      </div>

      <div className="relative flex flex-col gap-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Contraseña
        </label>
        <input
          type={isPassVisible ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          id="password"
          placeholder="Contraseña"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        {isPassVisible ? (
          <EyeSlashIcon
            className="absolute cursor-pointer top-10 right-2 dark:fill-black size-5"
            onClick={() => {
              setIsPassVisible((oldState) => !oldState)
            }}
          ></EyeSlashIcon>
        ) : (
          <EyeIcon
            className="absolute cursor-pointer top-10 right-2 dark:fill-black size-5"
            onClick={() => {
              setIsPassVisible((oldState) => !oldState)
            }}
          ></EyeIcon>
        )}
      </div>

      {errorMessage && (
        <div
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium text-center">{errorMessage}</span>
        </div>
      )}

      <button
        type="button"
        className="text-white bg-blue-700/70 hover:bg-blue-800/70 focus:ring-4 focus:outline-none focus:ring-blue-300/70 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600/80 dark:hover:bg-orange-700/80 dark:focus:ring-orange-800/80"
        onClick={() => {
          onRegister()
        }}
      >
        Registrarse
      </button>

      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
        onClick={() => {
          onLogin()
        }}
      >
        Iniciar Sesión
      </button>
    </form>
  )
}

Login.propTypes = {
  setLoading: PropTypes.func,
}

export default Login
