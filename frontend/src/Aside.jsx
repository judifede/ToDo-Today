import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getHistory, getHistoryById } from '../../Services/app.service'
import { calcTextResponseLength } from '../../utils/utils.js'

function Aside({ refreshHistory, setRefreshChosenHistory, setChosenHistory }) {
  const [history, setHistory] = useState([])
  const [historyStatus, setHistoryStatus] = useState('')

  const handleDate = (dateString) => {
    const date = new Date(dateString)

    const month = date.toLocaleString('es-ES', { month: 'short' })

    const returnDate =
      date.getDate() +
      ' ' +
      month.substring(0, 1).toUpperCase() +
      month.substring(1, month.length) +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes().toString().padStart(2, '0')

    return returnDate
  }

  //TODO: El historial cuando pulsas te muestra la frase que te mostró
  const handleOneHistory = async (id, phraseId) => {
    try {
      const resultHistory = await getHistoryById({ id, phraseId })

      setChosenHistory((chosenHistory) => ({
        ...chosenHistory,
        search: resultHistory.history.name,
        name: resultHistory.history.phrase.name,
        author: resultHistory.history.phrase.author,
        errorMessage: resultHistory.history.errorMessage,
        textResponseLength: calcTextResponseLength(resultHistory.history.phrase.name, resultHistory.history.phrase.author)
      }))

      setRefreshChosenHistory((value) => value + 1)

    } catch (err) {
      return err.message
    }
  }

  useEffect(() => {
    const handleGetHistory = async () => {
      try {
        const historyData = await getHistory()
        setHistoryStatus(historyData.result)

        if (historyData.result === 'Error') {
          //El historial está vacío
          setHistory(historyData.message)
        } else {
          setHistory(historyData.history)
        }
      } catch (err) {
          return err.message
      }
    }

    handleGetHistory()
  }, [refreshHistory])

  return (
    <aside className="flex flex-col lg:h-[100vh] lg:bg-white/90 bg-gray-100/90 p-10 relative">
      <header className="flex flex-col gap-2">
        <img src="/history.svg" alt="Logo Phrase AI" className="h-8" />

        <h2 className="mb-10 text-xl text-center">Historial</h2>
      </header>
      <section
        className={`flex flex-col gap-3 max-h-[calc(100vh-040px)] relative ${
          history.length >= 5 ? 'overflow-y-auto ' : ''
        } `}
      >
        {history && historyStatus !== 'Error'
          ? history.map((item) => (
                <article
                  key={item.id}
                  onClick={() => {
                    handleOneHistory(item.id, item.phraseId)
                  }}
                  className="hover:bg-gray-200 cursor-pointer flex flex-col gap-2 p-3 before:content-[''] relative before:absolute before:-bottom-[8px] before:left-1/4 before:bg-gray-300 before:h-[2px] before:w-1/2"
                >
                  <p className="">- {item.name}</p>
                  <p className="font-semibold text-xs flex justify-end">
                    {handleDate(item.createdAt)}
                  </p>
                </article>
            ))
          : history}
      </section>
    </aside>
  )
}

Aside.propTypes = {
  refreshHistory: PropTypes.number,
  setRefreshChosenHistory: PropTypes.func,
  setChosenHistory: PropTypes.func,
}

export default Aside
