import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '../assets/icons'
import { login, register } from '../Services/auth.service'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPassVisible, setIsPassVisible] = useState(false)

  const onLogin = async () => {
    try {
      const res = await login({ username, password })

      onLocalStorage(res)
    } catch (err) {
      console.error(err)
    }
  }

  const onRegister = async () => {
    try {
      const res = await register({
        username,
        password,
      })

      onLocalStorage(res)
    } catch (err) {
      console.error(err)
    }
  }

  const onLocalStorage = async (res) => {
    localStorage.setItem('token', res.token)
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
          placeholder="Usuario: admin"
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
          placeholder="Contraseña: admin"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        {isPassVisible ? (
          <EyeSlashIcon
            className="absolute cursor-pointer top-1/2 fill-black left-44 size-5"
            onClick={() => {
              setIsPassVisible((oldState) => !oldState)
            }}
          ></EyeSlashIcon>
        ) : (
          <EyeIcon
            className="absolute cursor-pointer top-1/2 fill-black left-44 size-5"
            onClick={() => {
              setIsPassVisible((oldState) => !oldState)
            }}
          ></EyeIcon>
        )}
        <EyeIcon
          className="absolute cursor-pointer top-1/2 text-red left-44 size-5"
          onClick={() => {
            setIsPassVisible((oldState) => !oldState)
          }}
        ></EyeIcon>
      </div>

      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={() => {
          onRegister()
        }}
      >
        Registrarse
      </button>

      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={() => {
          onLogin()
        }}
      >
        Iniciar Sesión
      </button>
    </form>
  )
}

export default Login
