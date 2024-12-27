import express, {Express, Request, Response} from "express";
import rootRouter from "./routes";
import session from 'express-session';
import passport from 'passport';

import './config/passport-setup';
import { isAuthenticated } from "./middlewares/google-auth";

import { UserType } from './types/index';

const app:Express = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })
);

// Protected route example
app.get('/dashboard', isAuthenticated, (req: Request, res: Response) => {

    const user = req.user as UserType;
    console.log(req.user)
    res.send(`Welcome ${user.name}`);
});


app.use('/api', rootRouter)

app.get('/', (req: Request, res: Response)=>{
    res.send("Working 👌")
})


app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})
