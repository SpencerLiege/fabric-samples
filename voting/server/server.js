import express from 'express'
import cors from 'cors'
import votingRouter from './routes/votingRouter.js'

const app = express()

// body parse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

// Routes
app.use('/api/voting', votingRouter)

// Error handling middleware

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})