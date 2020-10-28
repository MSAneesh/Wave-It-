const { urlencoded } = require('body-parser');

var express        =require('express'),
    app            =express(),
    passport       =require('passport'),
    LocalStrategy  =require("passport-local"),
    mongoose       =require("mongoose"),
    User           =require('./models/users'),
    bodyParser     =require("body-parser");



mongoose.connect("mongodb://localhost/theshopdb");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


app.use(require("express-session")({
    secret:"This is a secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render('Home')
})

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })
    })
})

app.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/login"}),function(req,res){});



app.get("/simulate",function(req,res){
    res.render("simulate")
})

app.listen(3000,function(){
    console.log("Server has started");
})

