require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.1.35:3000',  
    /^http:\/\/192\.168\.1\.\d+:3000$/, //  
  ],
  credentials: true
}))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api/upload', require('./routes/upload'))  
app.use('/api/products', require('./routes/productRouter'))
app.use('/api/services', require('./routes/serviceRouter'))
app.use('/api/foods',require('./routes/foodRouter'))

app.get('/', (req, res) => {
    res.send("APP IS RUNNING.")
})

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
  console.log("✅ Connected to MongoDB.")

  const PORT = process.env.PORT || 5000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📱 Local: http://localhost:${PORT}`)
    console.log(`🌐 Network: http://192.168.1.35:${PORT}`) // Your IP
    console.log(`📁 Uploads accessible at: http://localhost:${PORT}/uploads/`)
  })
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err)
})