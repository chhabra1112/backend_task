import express from 'express';
const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
  res.send('<h1>Welcome to the MERN Stack</h1>');
});

export default indexRouter;