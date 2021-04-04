// import files
import config from './config.js';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


// Routers
import userRouter from './routes/userRouter.js';
import jobRouter from './routes/jobsRouter.js'
import indexRouter from './routes/indexRouter.js'

// app config
const app = express();
const port = process.env.PORT || 9100;



// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));



// db config
mongoose.connect(config.mongo_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((db) => {
    console.log('Connected correctly to server');
  }, (err) => console.log(err));


// secure network
// app.all('*', (req, res, next) => {
// if (req.secure) {
//     return next();
// }
// else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
// }
// });



// api routes
app.use('/', indexRouter);
app.use('/user',userRouter);
app.use('/jobs',jobRouter);



// listen
app.listen(port,()=>console.log(`Listening on localhost ${port}`));

