const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require ("mongoose");
app.use(express.json());
mongoose.set('strictQuery', true)
const bodyParser = require('body-parser')

const User = require("./Models/users");
const userRoutes = require("./Routes/user");

mongoose.connect("mongodb://127.0.0.1:27017/mynewdb", {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, (err) => {
    if(!err)
    {
        console.log("connected to the database")        //connecting to the local mongodb
    } else{
        console.log("error")
    }
})     

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRoutes);



app.listen(3000,() => {
    console.log("on port 3000")
})


