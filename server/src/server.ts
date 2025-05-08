import express from "express"
import multer from "multer"
import cors from "cors"
import { exec } from "child_process"
import { ClientType, Innertube, UniversalCache, Utils, YTNodes } from "youtubei.js"

import fs, { createReadStream } from "node:fs"
import { promisify } from "node:util"

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
    const newName = file.path + "." + extension
    fs.rename(file.path, newName, () => {})
    return newName
}

function mimetype_to_extenstion(mimetype: string) {
    switch (mimetype) {
        case "image/png":
            return "png"
        case "image/webp":
            return "webp"
        default:
            throw new Error("INVALID MIME TYPE")
    }
}

const ytjsTest = async () => {

    const yt = await Innertube.create({
        cache: new UniversalCache(false), 
        generate_session_locally: true,
        client_type: ClientType.WEB_EMBEDDED
    })
    const search = await yt.search("mario")
    // const videos = search.results.filterType(YTNodes.Video)
    
    

    const stream = await yt.download('JbciZAlYUt0', {
        type: 'video',
        quality: 'best',
        format: 'mp4', 
        client: 'WEB'
    })

    const file = fs.createWriteStream("input/youtube.m4a")

    const iterable = Utils.streamToIterable(stream)

    for await (const chunk of iterable) {
        file.write(chunk)
    }
}

const downloadURL = async (url: string, callback?: (path: string) => void) => {
    exec(`yt-dlp --print after_move:filepath -o "output/%(title)s.%(ext)s" ${url}`, (error, stdout, stderr) => {
        const splitPath = stdout.split("/")
        const fileName = stdout.split("/")[splitPath.length - 1].trim()
        const path = `output/${fileName}`
        callback?.(path)
    })
}



app.post("/convert", upload.single("uploaded_file"), (req, res) => {
    if (!req.file) {
        res.send("FAILED")
        
        return
    }

    const base_extenstion = mimetype_to_extenstion(req.file.mimetype)
    const inputDir = add_file_extenstion(req.file, base_extenstion)

    const newExtenstion = "png"
    const outDir = `output/${req.file.filename}.${newExtenstion}`

    exec(`ffmpeg -i ${inputDir} -y -update true ${outDir}`, (err, stdout, stderr) => {
        res.sendFile(outDir, {root: "."}, (err) => {
            fs.unlink(outDir, () => {})
        })
    })
})

app.post("/download", (req, res) => {
    console.log(req.body.url)
    downloadURL(req.body.url, (filePath: string) => {
        res.sendFile(filePath, {root: "."}, (error) => {
            fs.unlink(filePath, (error) => {
                console.log(error + " DONE")
            })
        })
    })

})

app.listen(8080, () => {
    console.log("Server started on port 8080")
})