import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [array, setArray] = useState<Array<string>>([])

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api")
    const data : {
      fruits: Array<string>
    } = response.data

    setArray(data.fruits)
  } 

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <div>
      <label>
        FILE
        <input type='file'></input>
      </label>
      {
        array.map((fruit) => {
          return <p>{fruit}</p>
        })
      }
      <img alt='image'>
      </img>
    </div>
  )
}

export default App
