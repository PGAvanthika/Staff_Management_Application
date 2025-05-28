const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoute=require("./routes/authRoutes")
const adminRoute=require('./routes/adminRoute')
const sql = require('./config/db');
const userRoutes = require('./routes/user')
require('dotenv').config();



const PORT=process.env.PORT;
const app=express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.use('/api/user', userRoutes)
app.use("/api/admin",adminRoute)
app.use("/api/auth",authRoute)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})