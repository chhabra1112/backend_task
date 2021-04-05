
import User from '../models/users.js';
import auth from '../auth.js';
import express from 'express';
import originUrl from './origin.js';

var userRouter = express.Router();


userRouter.post('/register',function(req,res){
    res.header("Access-Control-Allow-Origin", originUrl);
        res.header("Access-Control-Allow-Credentials", true);
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
                );
    // taking a user
    const newuser=new User(req.body);
    
    User.findOne({email:newuser.email},function(err,user){
        if(user) return res.status(400).json({ auth : false, message :"email exits"});
 
        newuser.save((err,doc)=>{
            if(err) 
            {
                console.log(err);
                return res.status(400).json({ success : false});
            }
            res.status(200).json({
                succes:true,
                user : doc,
                isAuth:true,
                recruiter:doc.recruiter
            });
        });
    });
 });

 userRouter.route('/login')
 .post(function(req,res){
    res.header("Access-Control-Allow-Origin", originUrl);
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id,
                        recruiter:user.recruiter
                        ,email : user.email
                    });
                });    
            });
          });
        }
    });
});

userRouter.get('/profile',auth,function(req,res){
    res.header("Access-Control-Allow-Origin", originUrl);
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    if(!req.user){
        res.json({
            isAuth: false,
            error:"You are not logged in"
        })
    }
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        recruiter: req.user.recruiter
    })
});

userRouter.get('/logout',auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });

});

export default userRouter;