import mongoose from 'mongoose';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import pkg2 from 'bcrypt';
const { genSalt, hash: _hash, compare } = pkg2;
// const confiq = require('../config/config').get(process.env.NODE_ENV);
const salt = 10;
import config from '../config.js';

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    recruiter:{
        type:Boolean,
        default:false
    },
    token:String
})



userSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        genSalt(salt,function(err,salt){
            if(err)return next(err);

            _hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                next();
            })

        })
    }
    else{
        next();
    }
});

userSchema.methods.comparepassword=function(password,cb){
    compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

userSchema.methods.generateToken=function(cb){
    var user =this;
    var token=sign(user._id.toHexString(),config.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.findByToken=function(token,cb){
    var user=this;

    verify(token,config.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};

userSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

var Users = mongoose.model('User', userSchema);
export default Users;