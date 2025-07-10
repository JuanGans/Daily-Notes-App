import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import commentRoutes from './routes/comment'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/comments', commentRoutes)

const PORT = 5003
app.listen(PORT, () => {
  console.log(`✅ Comment service running on http://localhost:${PORT}`)
})
