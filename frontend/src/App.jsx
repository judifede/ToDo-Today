import { useState } from 'react'
import Login from './Login/Login'
import Todo from './Todo/Todo'

function App() {
  const [imageError, setImageError] = useState(false)

  return (
    <>
      {!imageError ? (
        <img
          src="/logo-texto_gray.png"
          alt="ToDo Today Logo"
          onError={() => setImageError(true)}
          style={{ width: '200px', height: 'auto' }}
        />
      ) : (
        <h1 className="m-0 text-2xl font-semibold">ToDo Today</h1>
      )}
      <h2 className="text-lg">Organiza tus tareas diarias</h2>
      <main className="relative flex flex-col items-center justify-between gap-5">
        {localStorage.getItem('token') === null ? (
          <Login></Login>
        ) : (
          <Todo></Todo>
        )}
      </main>
    </>
  )
}

export default App
