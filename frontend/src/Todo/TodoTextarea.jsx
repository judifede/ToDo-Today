import { useState } from 'react'
import PropTypes from 'prop-types'

const TodoTextarea = ({ tarea, checkboxStates, id, debouncedHandleUpdateTextarea }) => {
  const [textareaValue, setTextareaValue] = useState(tarea)

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value)
    debouncedHandleUpdateTextarea({ event, chosenID: id })
  }

  return (
    <textarea
      placeholder="Title"
      value={textareaValue}
      disabled={checkboxStates[id]}
      className={`${
        checkboxStates[id] ? 'line-through decoration-2 ' : ''
      } ${
        textareaValue.length < 30 ? 'leading-10 ' : 'leading-5'
      } w-full h-10 px-1 py-0 overflow-hidden text-sm font-medium bg-transparent border-0 rounded-none resize-none focus:ring-orange-400 focus:shadow-none hover:bg-transparent placeholder-text-secondary`}
      onChange={handleTextareaChange}
    ></textarea>
  )
}

TodoTextarea.propTypes = {
  tarea: PropTypes.string,
  checkboxStates: PropTypes.object,
  id: PropTypes.string,
  debouncedHandleUpdateTextarea: PropTypes.func,
}

export default TodoTextarea