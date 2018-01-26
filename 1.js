
var express = require("express");
var app = express();

var db = require("./model/db.js");
var session = require("express-session");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));




app.set("view engine","ejs");

app.use(express.static("./public"));



app.get("/",function(req,res){
    if(req.session.login == "1"){
        res.send("欢迎" + req.session.username);
    }else{
        res.send("没有成功登陆");
    }
})



app.get("/login",function(req,res){
    res.render("denglu");
})


app.get("/checklogin",function(req,res){

    var tianxieusername = req.query.username;
    var tianxiepassword = req.query.password;

    // console.log(tianxieusername);
    // console.log(tianxiepassword);
    // res.send("密码错误");

    db.find("users",{"username":tianxieusername},function(err,result){
        debugger;
        if(result.length ==0){
            res.send("你的登录名写错了，没有这个用户名");
            return;
        }

        var shujukupassword = result[0].password;
        if(shujukupassword==tianxiepassword){
            req.session.login = "1";
            req.session.username = result[0].username;
            res.send("成功登录！你是"+result[0].username);
        }else{
            res.send("密码错误");
        }
    })
})


app.listen(3001);