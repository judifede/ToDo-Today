import { useEffect } from 'react'
import './App.css'
import { deleteData, getData, putData } from './Services/app.service'
import { useState } from 'react'
import DeleteIcon from './assets/DeleteIcon'
import useDebounce from './hooks/hooks'

function App() {
  const [todoData, setTodoData] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const handleData = async () => {
      const todayData = await getData()
      setTodoData(todayData)
    }

    handleData()
  }, [refresh])

  const handleDelete = async (chosenID) => {
    try {
      const returnedData = await deleteData(chosenID)

      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = async (event) => {
    try {
      const fields = new window.FormData(event.target)
      console.log('Buscando')

      const search = fields.get('search')

      const lastID = todoData[todoData.length - 1].id

      const bodyObj = {
        tarea: search.trim(),
      }

      const returnedData = await putData(lastID, bodyObj)

      setRefresh((value) => value + 1)
      console.log(returnedData)
    } catch (err) {
      console.error(err)
    }
  }

  const debouncedHandleSearch = useDebounce(handleSearch, 800)

  const onSubmit = (event) => {
    event.preventDefault()
    debouncedHandleSearch(event)
  }

  const openPopup = () => {
    // chrome.sidePanel.close()
    chrome.action.openPopup()
  }

  const openSidePanel = () => {
    // chrome.action.closePopup()
    chrome.sidePanel.open()
  }

  return (
    <>
      <h1 className="m-0 text-2xl font-semibold">ToDo Today</h1>
      <h2 className="text-lg">Organiza tus tareas diarias</h2>

      <button type="button" id="openPopupButton" onClick={() => openPopup()}>
        Abrir Popup
      </button>
      <button
        type="button"
        id="openSidePanelButton"
        onClick={() => openSidePanel()}
      >
        Abrir SidePanel
      </button>

      <header className="w-80">
        <form
          onSubmit={(event) => {
            onSubmit(event)
          }}
          className="flex flex-col gap-5 justify-center items-center"
        >
          <div className="flex items-center">
            <input
              type="search"
              name="search"
              id="search"
              className="w-40 h-8 px-5 py-2 bg-gray-200 text-black border-0"
              autoFocus
            />
            {/* <button className="hidden">Enviar</button> */}
            <button
              className="group flex items-center h-8 gap-2 px-3 py-2 bg-green-600
            hover:bg-green-800 duration-300"
            >
              Añadir tarea
            </button>
          </div>
        </form>
      </header>

      <section className="w-80 flex flex-col gap-4">
        {todoData.map(({ id, tarea }) => (
          <article
            key={id}
            className="relative w-[95%] m-auto first:before:content-none
            before:content-[''] before:block
            before:w-full before:h-[2px]
          before:bg-yellow-100/70 before:mb-2"
          >
            <div className="flex justify-between gap-5 w-full">
              <span className="flex items-center justify-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100
                border-gray-300 rounded
                focus:ring-blue-500 focus:ring-1"
                  name={id}
                  id={id}
                />
                <label htmlFor={id} className="ms-2 text-sm font-medium">
                  {tarea}
                </label>
              </span>
              <DeleteIcon
                className="fill-red-400/80 w-4 cursor-pointer"
                onClick={() => {
                  handleDelete(id)
                }}
              ></DeleteIcon>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

export default App
