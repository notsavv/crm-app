import dotenv from "dotenv"
import express from "express"
import cors from "cors"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('server is running')
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}.`)
})