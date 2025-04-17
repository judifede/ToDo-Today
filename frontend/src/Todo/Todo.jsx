import { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../Services/todos.service'

import { useState } from 'react'
import { DeleteIcon, CloseIcon } from '../assets/icons'
import useDebounce from '../hooks/hooks'
import TodoTextarea from './TodoTextarea'
import { Tooltip } from 'flowbite-react'

function Todo({ setLoading }) {
  const [todoData, setTodoData] = useState([])
  const [addTodoText, setAddTodoText] = useState('')
  const [todoUpdatingText, setTodoUpdatingText] = useState('')
  const [checkboxStates, setCheckboxStates] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const handleData = async () => {
      setLoading(true)

      const todayData = await getTodos()

      setLoading(false)

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
  }, [refresh, setLoading])

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
      setLoading(true)
      const returnedData = await createTodo({ bodyObj })
      setLoading(false)
      if (returnedData.error) {
        setErrorMessage(returnedData.error)
        return
      }
      setAddTodoText('')
      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async ({ chosenID }) => {
    try {
      setLoading(true)
      const returnedData = await deleteTodo({ chosenID })
      setLoading(false)
      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateTextarea = async ({ event, chosenID }) => {
    const { value } = event.target
    setTodoUpdatingText(value.trim())

    try {
      const bodyObj = {
        tarea: value,
      }
      setLoading(true)
      await updateTodo({ chosenID, bodyObj })
      setLoading(false)
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
        tarea: todoUpdatingText.trim() || tarea.trim(),
        marcada: checked,
      }
      setLoading(true)
      await updateTodo({ chosenID, bodyObj })
      setLoading(false)
      setRefresh((value) => value + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const debouncedHandleKeyDownEnter = useDebounce(handleKeyDownEnter, 800)
  const debouncedHandleCreate = useDebounce(handleCreate, 800)
  const debouncedHandleUpdateTextarea = useDebounce(handleUpdateTextarea, 800)

  return (
    <>
      <header className="relative flex flex-col items-center justify-center gap-5 w-80">
        <div className="relative flex items-center justify-between gap-3">
          <input
            type="text"
            name="add-todo-text"
            id="add-todo-text"
            value={addTodoText}
            onChange={(e) => setAddTodoText(e.target.value)}
            onKeyDown={debouncedHandleKeyDownEnter}
            className="relative w-40 h-10 px-5 py-2 pr-10 text-black bg-gray-200 border-0 rounded"
            placeholder="Añadir tarea"
            autoFocus
          />
          <CloseIcon
            className="absolute text-black cursor-pointer right-32 size-5"
            onClick={() => setAddTodoText('')}
          ></CloseIcon>
          <button
            className="flex items-center h-10 gap-2 px-3 py-4 duration-300 rounded group 
            text-white bg-blue-700 hover:bg-blue-800  dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
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

      <section className="flex flex-col items-center justify-start gap-5 w-80 min-h-20 rounded-lg outline outline-1 outline-blue-400/40 dark:outline-orange-400/40">
        {todoData === undefined || todoData.length === 0 ? (
          <p className="text-center opacity-90">No hay tareas</p>
        ) : (
          todoData.map(({ _id: { $oid: id }, tarea }) => (
            <article
              key={id}
              className="relative w-[95%] h-10 first:before:content-none
            before:content-[''] before:block
            before:w-full before:h-[2px]
            before:bg-blue-300/70
          dark:before:bg-orange-300/70 before:-translate-y-[10px] "
            >
              <div className="flex items-center justify-between w-full gap-5">
                <span className="w-full flex items-center justify-start gap-5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-400 bg-gray-100 border-gray-300 rounded focus:ring-orange-400 focus:ring-1"
                    onChange={(event) =>
                      handleUpdateCheckbox({ event, chosenID: id, tarea })
                    }
                    checked={checkboxStates[id]}
                    name={id}
                    id={id}
                  />
                  <TodoTextarea
                    tarea={tarea}
                    checkboxStates={checkboxStates}
                    id={id}
                    debouncedHandleUpdateTextarea={
                      debouncedHandleUpdateTextarea
                    }
                  ></TodoTextarea>
                </span>
                <Tooltip content="Borrar tarea" placement="bottom">
                  <DeleteIcon
                    className="w-4 cursor-pointer fill-red-400/80"
                    onClick={() => {
                      handleDelete({ chosenID: id })
                    }}
                  ></DeleteIcon>
                </Tooltip>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  )
}

Todo.propTypes = {
  setLoading: PropTypes.func,
}

export default Todo
