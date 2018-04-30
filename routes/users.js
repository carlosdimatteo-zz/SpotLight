

const express = require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//bring article model
let User = require('../models/user');


// users shopping cart
router.get('/cart/:id',function(req,res){
    User.findById(req.params.id).select('cart').populate('cart._id').exec(function(err,usercart){
        console.log(usercart.cart);
        for(const i in usercart.cart){
            if(usercart.cart[i]._id===null){
                usercart.cart.splice(i,1);
                usercart.save(function(err){
                    if(err){console.log(err)}
                });
            }
        }
        res.render('cart',{
            cart:usercart.cart
        });
    });
});


// adding articles to shopping cart route
//functionality changed so you can add more tan one of the same article
router.get('/cart/add/:id',function(req,res){
    User.findById(req.user._id,function(err,user){
        console.log('user to update with push = '+user)
        for(const i in user.cart){
            if(user.cart[i]._id==req.params.id){
                user.cart[i].quantity=Number(user.cart[i].quantity)+1;
                user.save(function(err){
                    if(err){console.log(err);}
                });
                // req.flash('danger','this article has already been added');
                res.redirect('/users/cart/'+req.user._id);
                return;
            }
        }
        user.cart.push({_id:req.params.id,quantity:1});
        user.save(function(err){
            if(err){
                console.log(err);
            }
            res.redirect('/users/cart/'+req.user._id);
        });
    });
    });
    

// removing articles from the shopping cart
router.delete('/cart/:id',function(req,res){
    if(!req.user._id){
        res.status(500).send();
        return;
    }
User.findById(req.user._id,function(err,user){
        for(const i in user.cart){
            if(user.cart[i]._id==req.params.id){
                if(user.cart[i].quantity>1){
                    user.cart[i].quantity=user.cart[i].quantity-1;
                }else{
                user.cart.splice(i,1);}
                user.save(function(err){
                    if(err){console.log(err);}
                    res.send('success');
                    return;
                });
            }
        }
    });
});



// register form

router.get('/register', function(req,res){
    res.render('register');
});

//register process
router.post('/register',function(req,res){
        const name= req.body.name;
        const email= req.body.email;
        const username= req.body.username;
        const password= req.body.password;
        const password2= req.body.password2;

 req.checkBody('name','Name is required').notEmpty();
 req.checkBody('email','Email is required').isEmail();
 req.checkBody('username','username is required').notEmpty();
 req.checkBody('password','Password is required').notEmpty();
 req.checkBody('password2','Passwords do not match').equals(req.body.password);

 let errors=req.validationErrors();
 if(errors){
        res.render('register',{
            errors:errors
        });
 }else{
     let newUser = new User({
         name:name,
         email:email,
         username:username,
         password:password,
         cart:[]
     });
     bcrypt.genSalt(10,function(err,salt){
         bcrypt.hash(newUser.password, salt,function(err,hash){
             if(err){
                 console.log(err);
             }
             newUser.password = hash;
             newUser.save(function(err){
                 if(err){
                     console.log(err);
                     return;
                 }else{
                     req.flash('success','you are now registered and can login');
                     res.redirect('/users/login')
                 }
             });
         });
     });
 }
});
// login form
router.get('/login',function(req,res){
    res.render('login');
});

// login process
router.post('/login', function(req,res,next){
        passport.authenticate('local',{
            successRedirect:'/',
            failureRedirect:'/users/login',
            failureFlash:true,
        })(req,res,next);
});

// Logout
router.get('/logout',function(req,res){
        req.logout();
        req.flash('success','you are logged out');
        res.redirect('/users/login');
});
 


module.exports = router;