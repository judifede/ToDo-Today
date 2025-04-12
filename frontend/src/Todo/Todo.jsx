import { useEffect } from 'react'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../Services/todos.service'

import { useState } from 'react'
import { DeleteIcon, CloseIcon, LogoutIcon } from '../assets/icons'
import useDebounce from '../hooks/hooks'

function Todo() {
  const [todoData, setTodoData] = useState([])
  const [addTodoText, setAddTodoText] = useState('')
  const [todoUpdatingText, setTodoUpdatingText] = useState('')
  const [checkboxStates, setCheckboxStates] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const handleData = async () => {
      const todayData = await getTodos()
      
      if (todayData.error) {
        setErrorMessage(todayData.error)
        return
      }
      
      todayData.sort((a, b) => {
        if (!a.marcada && b.marcada) return -1
        return 0
      })
      setTodoData(todayData)

      // Inicializa el estado de los checkboxes con los valores de marcada
      const initialCheckboxStates = todayData.reduce(
        (acc, { _id: { $oid: id }, marcada }) => {
          acc[id] = marcada
          return acc
        },
        {}
      )
      setCheckboxStates(initialCheckboxStates)
    }

    handleData()
  }, [refresh])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      handleCreate()
    }
  }

  const handleCreate = async () => {
    try {
      const bodyObj = {
        tarea: addTodoText,
      }
      const returnedData = await createTodo({ bodyObj })

      if (returnedData.error) {
        setErrorMessage(returnedData.error)
        return
      }

      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async ({ chosenID }) => {
    try {
      const returnedData = await deleteTodo({ chosenID })

      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateTextarea = async ({ event, chosenID }) => {
    const { value } = event.target
    setTodoUpdatingText(value)

    try {
      const bodyObj = {
        tarea: value,
      }

      await updateTodo({ chosenID, bodyObj })
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateCheckbox = async ({ event, chosenID, tarea }) => {
    const { checked } = event.target

    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [chosenID]: checked,
    }))
    try {
      const bodyObj = {
        tarea: todoUpdatingText || tarea,
        marcada: checked,
      }

      await updateTodo({ chosenID, bodyObj })

      setRefresh((value) => value + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const debouncedHandleKeyDownEnter = useDebounce(handleKeyDownEnter, 800)
  const debouncedHandleCreate = useDebounce(handleCreate, 800)

  return (
    <>
      <LogoutIcon
        className="self-end text-red-400 cursor-pointer size-6"
        onClick={() => {
          logout()
        }}
      ></LogoutIcon>
      <header className="relative flex flex-col items-center justify-center gap-5 w-80">
        <div className="relative flex items-center">
          <input
            type="text"
            name="add-todo-text"
            id="add-todo-text"
            value={addTodoText}
            onChange={(e) => setAddTodoText(e.target.value)}
            onKeyDown={debouncedHandleKeyDownEnter}
            className="relative w-40 h-10 px-5 py-2 text-black bg-gray-200 border-0"
            placeholder="Añadir tarea"
            autoFocus
          />
          <CloseIcon
            className="absolute text-black cursor-pointer right-28 size-5"
            onClick={() => setAddTodoText('')}
          ></CloseIcon>
          <button
            className="flex items-center h-10 gap-2 px-3 py-4 duration-300 bg-green-600 group hover:bg-green-800"
            onClick={() => {
              debouncedHandleCreate()
            }}
          >
            Añadir tarea
          </button>
        </div>
      </header>
      
      {errorMessage && (
        <div
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium text-center">{errorMessage}</span>
        </div>
      )}
      
      <section className="flex flex-col justify-start gap-5 w-80 min-h-20">
        {todoData === undefined || todoData.length === 0 ? (
          <p className="text-center opacity-90">No hay tareas</p>
        ) : (
          todoData.map(({ _id: { $oid: id }, tarea }) => (
            <article
              key={id}
              className="relative w-[95%] h-5 first:before:content-none
            before:content-[''] before:block
            before:w-full before:h-[2px]
          before:bg-yellow-100/70 before:-translate-y-[10px] "
            >
              <div className="flex justify-between w-full gap-5">
                <span className="flex items-center justify-start gap-5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    onChange={(event) =>
                      handleUpdateCheckbox({ event, chosenID: id, tarea })
                    }
                    checked={checkboxStates[id]}
                    name={id}
                    id={id}
                  />
                  <textarea
                    placeholder="Title"
                    defaultValue={tarea}
                    disabled={checkboxStates[id]}
                    className={`${
                      checkboxStates[id] ? 'line-through decoration-2 ' : ''
                    } w-full h-5 px-1 py-0 overflow-hidden text-sm font-medium leading-5 bg-transparent border-0 rounded-none resize-none  focus:ring-yellow-200 focus:shadow-none hover:bg-transparent placeholder-text-secondary`}
                    onChange={(event) =>
                      handleUpdateTextarea({ event, chosenID: id })
                    }
                  ></textarea>
                </span>
                <DeleteIcon
                  className="w-4 cursor-pointer fill-red-400/80"
                  onClick={() => {
                    handleDelete({ chosenID: id })
                  }}
                ></DeleteIcon>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  )
}

export default Todo
