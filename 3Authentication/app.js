const express= require('express')
const app=express();
const userModel=require('./models/users')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    let user= await userModel.findOne({email});
    if(!user) res.send("Somthing went Wrong");
    bcrypt.compare(password,user.password, function(err, result) {
        if(result) {
            let token=jwt.sign({email},"shhhhhhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.send("Successfull login")
        }
        else res.send("Somthing went Wrong password");
    });
    
})
app.post('/create',(req,res)=>{
    let {name,email,password,age}=req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            let createdUser=await userModel.create({
                name,
                email,
                password:hash,
                age
            })
            let token=jwt.sign({email},"shhhhhhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.send(createdUser);
        });
    });
    
})
app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})
app.listen(3000);