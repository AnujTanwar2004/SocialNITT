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
  origin: 'http://localhost:3000',     
  credentials: true                   
}))

app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api/upload', require('./routes/upload')) // now routes like /api/upload/upload_avatar
app.use('/api/products', require('./routes/productRouter'))


app.get('/', (req, res) => {
    res.send("APP IS RUNNING.")
})

// ✅ Mongoose v7+ compatible connection
mongoose.connect(process.env.MONGODB_URL)

.then(() => {
  console.log("✅ Connected to MongoDB.")

  // Start server only after DB connection success
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
  })

})
.catch(err => {
  console.error("❌ MongoDB connection error:", err)
})
