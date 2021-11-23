import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './users/users.js';


const app = express();
const port = 8000;

app.use((_req, _res, next) => {
    console.log('Current time: ', Date.now());
    next();
});

app.use('/users', userRouter);

app.all('/hello', (_req, _res, next) => {
    console.log('Middleware sucks!');
    next();
});

app.get('/hello', (_req, res) => {
    res.type('application/json')
    // res.append('Warning', '375');
    throw new Error("There was an error!!!11");
    res.send('Hello!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(500).send(err.message);
});


app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});