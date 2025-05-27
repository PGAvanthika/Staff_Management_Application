const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoute=require("./routes/authRoutes")
const adminRoute=require('./routes/adminRoute')
const sql = require('./config/db');
require('dotenv').config();



const PORT=process.env.PORT;
const app=express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.get("/",(req,res)=>{
    console.log(res.getHeaders()) 
    res.send("Hello!")
})

const initDB=async ()=>{
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS admin(
        ID VARCHAR(20) PRIMARY KEY,
        EMAIL VARCHAR(50),
        PASSWORD VARCHAR(30) NOT NULL
        );
        `
        console.log("connected")
    } catch(err){
        console.log("Error in connecting DB:"+err)
    }
}
initDB()

app.use("/api/admin",adminRoute)
app.use("/api/auth",authRoute)

app.get("/Adminhome",(req,res)=>{
    console.log("Welcome to admin homepage!")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})