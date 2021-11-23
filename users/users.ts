import express from 'express';

const userRouter = express.Router();

userRouter.use((_req, _res, next) => {
    console.log(`User specific middleware`);
    next();
});

userRouter.post('/login', (_req, res) => {
    res.send('Login was successful');
});

userRouter.post('/register', (_req, res) => {
    res.send('Registration was successful');
});

export { userRouter };