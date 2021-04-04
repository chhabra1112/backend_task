import Jobs from '../models/jobs.js';
import express from 'express';
import auth from '../auth.js'
import userRouter from './userRouter.js';
import Applications from '../models/applications.js'
import cors from './cors.js';

var jobRouter = express.Router();
jobRouter.route('/')
.get(auth,function(req,res,next){
    if(req.user.recruiter){
    Jobs.find({recruiter:req.user._id})
    .then((jobs) => {
        res.statusCode = 200;
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials":true
        });
        res.json(jobs);

    }, (err) => next(err))
    .catch((err) => next(err));
} else{
    Jobs.find(req.query)
    .populate('recruiter')
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
}
}
)

jobRouter.post('/',auth,function(req,res,next){
    console.log("ddd")
    if(!req.user){
        err = new Error('not logged in');
        err.status = 400;
        console.log(err);
        return next(err);
    }
    else{
    if(req.user.recruiter){
        if (req.body != null) {
            req.body.recruiter = req.user._id;
            req.body.seekers = [];
            Jobs.create(req.body)
                .then((job) => {
                    Jobs.findById(job._id)
                        .populate('recruiter')
                    .then((job) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(job);
                    })
                }, (err) => next(err))
                .catch((err) => next(err))
        } else {
            err = new Error('Comment not found in body');
            err.status = 404;
            return next(err);
        }
}else{
    return res.status(400).json({
        error :true,
        message:"You are not a recruiter"
    });
}
    }
}
)



jobRouter.get('/applied',auth,(req,res,next)=>{
    if(!req.user.recruiter){
            Applications.find({seeker:req.user._id})
            .populate('job_id')
                .then((applications) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(applications);
                }, (err) => next(err))
                .catch((err) => next(err))
}else{
    return res.status(400).json({
        error :true,
        message:"You are a recruiter"
    });
}

})

jobRouter.post('/:jobId',auth,(req,res,next)=>{
    if(!req.user.recruiter){
            Applications.create({job_id:req.params.jobId,
                seeker:req.user._id})
                .then((applications) => {
                    Applications.find({seeker:req.user._id})
                    .populate('seekers')
                    .populate('job_id')
                    .then(applications=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(applications);
                })}, (err) => next(err))
                .catch((err) => next(err))
}else{
    return res.status(400).json({
        error :true,
        message:"You are a recruiter"
    });
}

})

jobRouter.get('/:jobId',auth,(req,res,next)=>{
    if(req.user.recruiter){
            Applications.find({job_id:req.params.jobId})
            .populate('seeker')
                .then((applications) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(applications);
                }, (err) => next(err))
                .catch((err) => next(err))
}else{
    return res.status(400).json({
        error :true,
        message:"You are not a recruiter"
    });
}

})

export default jobRouter;

