import { ChangeEvent, useState } from 'react'
import './App.css'

function App() {

  const [source, setSource] = useState("")
  const [currentFile, setCurrentFile] = useState<File>()

  const [videoSource, setVideoSource] = useState("")

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    setCurrentFile(event.target.files[0])
  } 

  const handleSubmit = async () => {
    if (!currentFile) {
      console.log("NO FILE!")
      return
    }

    const formData = new FormData
    formData.append("uploaded_file", currentFile)

    const string = await fetch("http://localhost:8080/convert", {
      method: 'POST',
      body: formData,
    })

    const response = await string.blob()
    const url = URL.createObjectURL(response)
    setSource(url)
  }

  const handleYoutube = async () => {
    const video = await fetch("http://localhost:8080/download", {
      method: "POST",
      body: JSON.stringify({
        url: "https://www.youtube.com/watch?v=6c28qWDMPBA"
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })

    const videoBlob = await video.blob()
    const url = URL.createObjectURL(videoBlob)
    setVideoSource(url)
  }

  return (
    <div>
      <button onClick={handleSubmit}>SUMBIT</button>
      <button onClick={handleYoutube}>YOUTUBE</button>
      <label>
        IMAGE
        <input type='file' onChange={handleFileChange}></input>
      </label>

      {
      source !== '' && <img alt='image' src={source}/>
      }

      {
      videoSource !== '' && <video src={videoSource}/>
      }
    </div>
  )
}

export default App
