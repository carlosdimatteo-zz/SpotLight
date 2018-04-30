const express = require('express');
const path= require('path');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const expressValidator= require('express-validator');
const flash= require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config=require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//check connection

db.once('open', function(){
    console.log('connected to mongodb');
});



//check for db errors
db.on('error',function(err){
         console.log(err);
})


//init app
const app =express();


// bring in models
let Article=require('./models/article');
 
//load view engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug');



// body parser middleware 
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));



//parse application/json
app.use(bodyParser.json());

//express validator middleware
app.use(expressValidator({
    errorFormtter:function(param,msg,value){
        var namespace=param.split(','),
        root=namespace.shift(),
        formParam=root;
        while(namespace.length){
            formParam +='['+namespace.shift()+']';
        }
        return{
            param:formParam,
            msg:msg,
            value:value
        };
    }
}));


//Express session middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true,
}));


// passport config
require('./config/passport')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global user variable
app.get('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
})




// express messages middleware
app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages=require('express-messages')(req,res);
    next();
});


//set public folder
app.use(express.static(path.join(__dirname,'public')));

//home route
app.get('/',(req,res)=>{
    Article.find({}, function(err,articles){
                if(err) {console.log(err);}
        res.render('index',{
            title:'Articles',
            articles:articles
        });
    });
});

// Search route 
app.post('/',function(req,res){
    Article.find({ title : new RegExp(req.body.search,'i')},function(err,articles){
        if(err){console.log(err);}
        res.render('index',{
            title:'Articles',
            articles:articles
        });
    });
});


//route files..
let articles = require('./routes/articles');
app.use('/articles',articles);
let users = require('./routes/users');
app.use('/users',users);

//server start
app.listen('9090',function(){
    console.log('srver started at port 9090')
});