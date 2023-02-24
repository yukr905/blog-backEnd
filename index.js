const express = require("express")
const mongo = require("mongoose")
const multer = require("multer")
const auth = require("./validation/auth-validation")
const app = express()

mongo.connect("mongodb+srv://admin:admin@cluster0.ddhij74.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("BD OK"))
.catch((err)=>console.log(err))


app.use(express.json())
app.use("/auth", require("./router/auth-router"))
app.use("/posts",require("./router/post-router"))
app.use("/uploads",express.static("uploads"))

app.listen(3000,()=>{
    console.log("Server started")
})