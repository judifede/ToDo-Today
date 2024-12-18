import api from './config'

export const getData = async () => {
  try {
    const { data } = await api.get('/data', {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
    
  }
}

export const putData = async (lastID, bodyObj) => {
  try {
    const { data } = await api.put(`/data/${lastID}`, bodyObj, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
    
  }
}

export const deleteData = async (lastID) => {
  try {
    const { data } = await api.delete(`/data/${lastID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (err) {
    console.error(err)
    
  }
}