
import User from './models/users.js'

let auth =(req,res,next)=>{
    let token =req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) {
            res.statusCode = 404;
            return res.json({
            error :true,
            message:"not logged in"
    }
        );
}
        req.token= token;
        req.user=user;
        next();

    })
}

export default auth;