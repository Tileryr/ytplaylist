import { useEffect, useState } from 'react'

import './App.css'

function App() {
  const [array, setArray] = useState<Array<string>>([])

  const fetchAPI = async () => {
    const response = await fetch("http://localhost:8080/api")

    const data : {
      fruits: Array<string>
    } = await response.json() 

    setArray(data.fruits)
  } 

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <div>
      <button onClick={async () => {
        const string = await fetch("http://localhost:8080/auth", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: "HI" })
        })

        const response = await string.text()
        console.log(response)
        
      }}>Click</button>
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
