const express=require('express')
const app=express();
const path=require('path')
const userModel=require('./model/user');
const user = require('./model/user');
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/read", async(req,res)=>{
    let Users= await userModel.find();
    res.render("read",{Users});
})
app.get("/delete/:id", async(req,res)=>{
    await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
})
app.get("/edit/:id", async(req,res)=>{
    let user=await userModel.findOne({_id:req.params.id});
    res.render("edit",{user});
})
app.post("/create", async (req,res)=>{
    let {name,email,image}=req.body;
    let createdUser=await userModel.create({
        name,
        email,
        image
    })
    res.redirect("/read");
})
app.post("/edit", async (req,res)=>{
    let {oldname,newname,oldemail,newemail}=req.body;
    if(newname.length>0){
        await userModel.findOneAndUpdate({name:oldname},{name:newname},{new:true});
    }
    if(newemail.length>0){
        await userModel.findOneAndUpdate({email:oldemail},{email:newemail},{new:true});
    }
    res.redirect("/read");
})
app.listen(3000); 