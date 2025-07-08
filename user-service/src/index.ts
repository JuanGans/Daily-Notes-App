import express from 'express'
import cors from 'cors'
import userRoutes from './routes/users'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Semua route user masuk ke prefix /users
app.use('/users', userRoutes)

// Optional root endpoint
app.get('/', (_req, res) => {
  res.send('🚀 User Service API is running!')
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
