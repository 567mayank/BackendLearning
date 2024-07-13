const express=require('express')
const app=express()
const userModel=require('./models/user')
const postModel=require('./models/post')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const user = require('./models/user')
// const 
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/profile',isLoggedIn,async(req,res)=>{
    let foundUser = await userModel.findOne({email:req.user.email}).populate("posts");
    console.log(foundUser);
    res.render("profile",{user:foundUser})
})

app.post("/post",isLoggedIn,async (req,res)=>{
    let foundUser = await userModel.findOne({email:req.user.email});
    let createdPost=await postModel.create({
        user:foundUser._id,
        content:req.body.content,
    })
    foundUser.posts.push(createdPost._id);
    await foundUser.save();
    res.redirect("/profile")
})
app.post("/create",async (req,res)=>{
    let {name,username,age,email,password}=req.body;
    let user= await userModel.findOne({email});
    if(user) return res.status(500).send("User already Exist");
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let createdUser=await userModel.create({
                name,
                username,
                email,
                age,
                password:hash
            })
            let token=jwt.sign({email:email,userid:createdUser._id},"shhhhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.send("Registered");
        });
    });
})
app.post("/login",async (req,res)=>{
    let {email,password}=req.body;
    let user= await userModel.findOne({email});
    if(!user) return res.status(500).send("Something Went Wrong");
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            let token=jwt.sign({email,userid:user._id},"shhhhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.redirect("profile");
        }
        else return res.status(500).send("Something Went Wrong");
    });    
})
app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect('/login');
})
function isLoggedIn(req,res,next){
    if(req.cookies.token=="") res.redirect("/login")
    else{
        let data=jwt.verify(req.cookies.token,"shhhhhhhhhhhhhhhh");
        req.user=data;
        next();
    }
}
app.listen(3000)