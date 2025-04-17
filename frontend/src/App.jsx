import { useEffect, useState } from 'react'
import Login from './Login/Login'
import Todo from './Todo/Todo'
import {
  BoldIcon,
  LogoutIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  Spinner,
  SunIcon,
} from './assets/icons'
import { Dropdown, Tooltip } from 'flowbite-react'

function App() {
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [isBold, setIsBold] = useState(false)

  const decreaseFont = () => {
    const newFontSize = Math.max(fontSize - 2, 10) // No permitir que el tamaño de fuente sea menor a 10px
    setFontSize(newFontSize)
    document.documentElement.style.fontSize = `${newFontSize}px`
  }

  const increaseFont = () => {
    const newFontSize = Math.min(fontSize + 2, 40) // No permitir que el tamaño de fuente sea mayor a 50px
    setFontSize(newFontSize)
    document.documentElement.style.fontSize = `${newFontSize}px`
  }

  const toggleBold = () => {
    setIsBold((prevIsBold) => !prevIsBold)
    document.documentElement.style.fontWeight = isBold
      ? 'normal !important'
      : 'bold !important'
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <>
      <header className="w-full px-2 flex items-center justify-end gap-1">
        <Dropdown
          label={<SettingsIcon></SettingsIcon>}
          dismissOnClick={false}
          arrowIcon={false}
          inline={true}
        >
          <Tooltip content="Disminuir Fuente" placement="right">
            <Dropdown.Item
              onClick={decreaseFont}
              className="justify-center px-8"
            >
              <MinusIcon className="w-5 h-5" />
            </Dropdown.Item>
          </Tooltip>
          <Tooltip content="Aumentar Fuente" placement="right">
            <Dropdown.Item
              onClick={increaseFont}
              className="justify-center px-8"
            >
              <PlusIcon className="w-5 h-5" />
            </Dropdown.Item>
          </Tooltip>
          <Tooltip content="Fuente en Negrita" placement="right">
            <Dropdown.Item onClick={toggleBold} className="justify-center px-8">
              <BoldIcon className="w-5 h-5" />
            </Dropdown.Item>
          </Tooltip>
          <Tooltip content="Cambiar Modo" placement="right">
            <Dropdown.Item
              onClick={toggleDarkMode}
              className="justify-center px-8"
            >
              <MoonIcon></MoonIcon>
              <SunIcon></SunIcon>
            </Dropdown.Item>
          </Tooltip>
          {localStorage.getItem('token') && (
            <Tooltip content="Cerrar sesión" placement="right">
              <Dropdown.Item onClick={logout} className="justify-center px-8">
                <LogoutIcon
                  title="Cerrar sesión"
                  className="text-red-400 cursor-pointer w-5 h-5"
                />
              </Dropdown.Item>
            </Tooltip>
          )}
        </Dropdown>
        {/* <Tooltip content="Disminuir Fuente" placement="bottom">
          <button className="px-1" onClick={decreaseFont}>
            <MinusIcon></MinusIcon>
          </button>
        </Tooltip>
        <Tooltip content="Aumentar Fuente" placement="bottom">
          <button className="px-1" onClick={increaseFont}>
            <PlusIcon></PlusIcon>
          </button>
        </Tooltip>
        <Tooltip content="Fuente en Negrita" placement="bottom">
          <button onClick={toggleBold}>
            <BoldIcon></BoldIcon>
          </button>
        </Tooltip>
        <button
          onClick={toggleDarkMode}
          className="px-2 bg-transparent text-white rounded"
        >
          <Tooltip content="Cambiar Modo" placement="bottom">
            <MoonIcon></MoonIcon>
            <SunIcon></SunIcon>
          </Tooltip>
        </button>
        {localStorage.getItem('token') === null ? (
          ''
        ) : (
          <Tooltip content="Cerrar sesión">
            <LogoutIcon
              title="Cerrar sesión"
              className="text-red-400 cursor-pointer size-6"
              onClick={() => {
                logout()
              }}
            ></LogoutIcon>
          </Tooltip>
        )} */}
      </header>
      {!imageError ? (
        <img
          src={isDarkMode ? '/logo-texto_gray.png' : '/logo-texto_black.png'}
          alt="ToDo Today Logo"
          onError={() => setImageError(true)}
          style={{ width: '150px', height: 'auto' }}
        />
      ) : (
        <h1 className="m-0 text-2xl font-semibold text-center">ToDo Today</h1>
      )}
      <h2 className="text-lg text-center">Organiza tus tareas diarias</h2>
      <section className="relative flex flex-col items-center justify-between gap-5">
        {localStorage.getItem('token') === null ? (
          <Login setLoading={setLoading}></Login>
        ) : (
          <Todo setLoading={setLoading}></Todo>
        )}

        {loading && <Spinner />}
      </section>
    </>
  )
}

export default App
