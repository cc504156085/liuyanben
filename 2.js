var express = require("express");
var app = express();

var db = require("./model/db.js");

var formidable = require("formidable");
var ObjectId = require('mongodb').ObjectID;

app.set("view engine","ejs");

app.use(express.static("./public"));

app.get("/",function(req,res,next){
    db.getAllCount("liuyanben",function(count){
        res.render("index",{
            "pageamount" : Math.ceil(count / 20)
        })
    })
})

//读取所有留言，这个页面是供Ajax使用的
app.get("/du",function(req,res,next){

    var page = parseInt(req.query.page);

    db.find("liuyanben",{},{"sort":{"shijian":-1},"pageamount":20,"page":page},function(err,result){
       res.json({"result":result});
    });
});


//处理留言
app.post("/tijiao",function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {
        //写入数据库
        db.insertOne("liuyanben", {
            "xingming" : fields.xingming,
            "liuyan" : fields.liuyan,
            "shijian" : new Date()
        }, function (err, result) {
            if(err){
                res.send({"result":-1}); //-1是给Ajax看的
                return;
            }
            res.json({"result":1});
        });
    });
})


//删除
app.get("/shanchu",function(req,res,next){

   var id = req.query.id;

   db.deleteMany("liulanben",{"id":Object(id)},function(err,result){
       res.redirect("/");
   })
});

app.listen(4000);
