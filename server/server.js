const express = require("express")
const app = express();
const cors = require("cors")

const { exec } = require("child_process")

const corsOptions = {
    origin: ("http://localhost:5173")
}


app.use(express.json())
app.use(cors(corsOptions))

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"]})
    exec
});

// app.use(express.json)
app.post("/auth", (req, res) => {
    
    console.log(req.body)
    console.log("msg got!")

    res.send("you clicked")
})

app.listen(8080, () => {
    console.log("Server started on port 8080")
})