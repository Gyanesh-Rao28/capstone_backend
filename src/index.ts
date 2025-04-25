// src/index.ts

import express, {Express, Request, Response} from "express";
import rootRouter from "./routes";
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import './config/passport-setup';
import { isAuthenticated } from "./middlewares/google-auth";

import { UserType, UserWithToken } from './types/index';

import { initializeFileSystem } from './helper/fileSystem';


const app:Express = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
}))

initializeFileSystem();

// Oautn routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email'
        ]
    })  
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false
    }),
    (req, res) => {
        // getting user's info from passport-setup.ts
        const user = req.user as UserWithToken;

        console.log(user)

        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${user.accessToken}`);
    }
);

// Protected route testing
app.get('/dashboard', isAuthenticated, (req: Request, res: Response) => {

    const user = req.user as UserType;  
    console.log(req.user)
    res.send(`Welcome ${user.name}`);

});

// Entery point of API
app.use('/api', isAuthenticated, rootRouter)



// Just for intial deployment testing
app.get('/', (req: Request, res: Response)=>{
    res.send(`Working 👌: ${process.env.FRONTEND_URL}` )
})


app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})

export default app;