//jshint esversion:6
var express = require('express')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var mongoose = require('mongoose')
var secret = require('mongoose-encryption')
require('dotenv').config()
const app = express()

app.use(express.static("public"));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true})
var userSchema=new mongoose.Schema({
    email: String,
    password: String
})
app.get("/",function(req,res){
    res.render("home");
})
userSchema.plugin(secret,{secret:process.env.SECRET,encryptedFields:["password"]})
const User= new mongoose.model("User",userSchema);

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/login",function(req,res){
    const email = req.body.username
    const password = req.body.password
    User.findOne({email: email}).then((foundUser)=>{
        console.log(foundUser)
        if(foundUser){
            if(foundUser.password==password){
                res.render("secrets")
            }
            else{
                res.render("login")
            }
        }
        else{
            res.render("login")
        }
    }).catch(err=>{
        console.log(err)
        res.render("login")
    })
    
})

app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })
    //error was save function in mongoose now doesn't accept callbacks
    // newUser.save(function(err){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         res.render("secrets")
    //     }
    // })
    newUser.save().then(result=>{
        console.log('result',result);
        res.render("secrets")
    }).catch((err)=>{
        console.log('error',err)
    })
})

app.listen(3000, function(){
    console.log("server started on port 3000");
})