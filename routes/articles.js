const express = require('express');
const router=express.Router();

//bring article model
let Article = require('../models/article');
//bring user model
let User = require('../models/user');




// load edit form
router.get('/edit/:id',isAuth,(req,res)=>{
    Article.findById(req.params.id,function(err,article){
        if(article.author.toString()!=req.user._id.toString()){
            req.flash('danger','not authorized');
            res.redirect('/');
            return;
        }
        res.render('edit_article',{
            title:'Edit',
            article:article
         })
    });
});

//add article route
router.get('/add',isAuth,(req,res)=> {
    res.render('add_article',{
       title:'add article'
    })

})


// add submit post route
router.post('/add',(req,res)=>{
    req.checkBody('title','Title is required').notEmpty();
  //  req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    req.checkBody('price','Price is required').notEmpty();
    req.checkBody('stock','Stock is required').notEmpty();
    
    // get errors
    let errors=req.validationErrors();
    if(errors){
        res.render('add_article',{
            title:'Add Article',
            errors:errors
        });
    }else{
        let article = new Article();
        article.title = req.body.title;
        article.author=req.user._id;
        article.body=req.body.body;
        article.price=req.body.price;
        article.stock=req.body.stock;
        article.save(function(err){
            if(err){console.log(err);
            return;
            } else{
                req.flash('success','Article Added');
                res.redirect('/');
            }
        });
    }
});

    


//update submit
router.post('/edit/:id',(req,res)=>{
    let article={};
    req.checkBody('title','Title is required').notEmpty();
  //  req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    req.checkBody('price','Price is required').notEmpty();
    req.checkBody('stock','Stock is required').notEmpty();
    article.title = req.body.title;
    article.author=req.user._id;
    article.body=req.body.body;
    article.price=req.body.price;
    article.stock=req.body.stock;
    let query={_id:req.params.id};
    Article.update(query,article,function(err){
        if(err){console.log(err);
        return;
        } else{
            req.flash('success','Article Updated');
            res.redirect('/');
        }
    });
});



//article delete route
router.delete('/:id',(req,res)=>{
        if(!req.user._id){
            res.status(500).send();
        }
    let query={_id:req.params.id};
Article.findById(req.params.id,function(err,article){
    if(article.author.toString()!=req.user._id.toString()){
        res.status(500).send();
    }else{
        Article.remove(query,function(err){
            if (err){
                console.log(err);
            }
            res.send('success');
        });
    }
})

    
});


//get single article
router.get('/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){
        User.findById(article.author,function(err,user){
            res.render('article',{
                article:article,
                author:user.username
             })
        })
        
    });
});


//acces control
function isAuth(req,res,next){
            if(req.isAuthenticated()){
                return next();
            } else{
                req.flash('danger','Please login');
                res.redirect('/users/login');
            }
}

module.exports = router;