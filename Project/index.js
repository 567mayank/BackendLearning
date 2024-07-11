const express=require("express");
const app=express();
const path=require("path")
const fs=require("fs");
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        res.render("index",{files:files});
    })
})
app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
        res.render("show",{filename:req.params.filename,filedata:filedata});
    })
})
app.get("/edit/:filename",(req,res)=>{
    res.render("edit",{filname:req.params.filename});
})


app.post("/create",(req,res)=>{
    if(req.body.title.length<=0) return res.redirect("/")
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
        res.redirect("/");
    })
})
app.post("/delete/:filname",(req,res)=>{
    fs.rm(`./files/${req.params.filname}`,(err)=>{
        res.redirect("/");
    })
})
app.post("/edit",(req,res)=>{
    fs.rename(`./files/${req.body.prev}`,`./files/${req.body.new}`,(err)=>{
        console.log(req.body.prev);
        console.log(req.body.new);
        res.redirect("/");
    })
})
app.listen(3000,()=>{
    console.log("working")
});