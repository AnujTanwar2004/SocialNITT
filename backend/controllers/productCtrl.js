require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))

app.get('/', (req, res) => {
    res.send("APP IS RUNNING.")
})

  mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB.")

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
  })

})
.catch(err => {
  console.error("❌ MongoDB connection error:", err)
})
