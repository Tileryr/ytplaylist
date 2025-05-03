import express from "express"
import multer from "multer"
import cors from "cors"
import { exec } from "child_process"
import fs from "node:fs"

const upload = multer({ dest: "input/", })
const app = express();

const corsOptions = {
    origin: ("http://localhost:5173")
}

app.use(cors(corsOptions))
app.use(express.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded"
}))

app.use(express.json())

function add_file_extenstion(file: Express.Multer.File, extension: string) {
    fs.rename(file.path, file.path + extension, () => {})
    return file.path + extension
}

app.post("/convert", upload.single("uploaded_file"), (req, res) => {
    if (!req.file) {
        res.send("FAILED")
        return
    }

    const inputDir = add_file_extenstion(req.file, ".png")
    const outDir = "output/image.png"

    exec(`ffmpeg -i ${inputDir} -y -update true ${outDir}`, (err, stdout, stderr) => {
        res.sendFile(outDir, {root: "."})
    })
})

app.listen(8080, () => {
    console.log("Server started on port 8080")
})