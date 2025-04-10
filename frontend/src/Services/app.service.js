import api from './config'

export const getTodos = async () => {
  try {
    const { data } = await api.get('/todos', {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
  }
}

export const createTodo = async ({ bodyObj }) => {
  try {
    const { data } = await api.post(`/todos`, bodyObj, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
  }
}

export const updateTodo = async ({ chosenID, bodyObj }) => {
  try {
    const { data } = await api.put(`/todos/${chosenID}`, bodyObj, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
  }
}

export const deleteTodo = async ({ chosenID }) => {
  try {
    const { data } = await api.delete(`/todos/${chosenID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
  }
}