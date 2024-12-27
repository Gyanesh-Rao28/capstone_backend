// src/config/passport-setup.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db';
import { UserType } from '../types/index';

passport.serializeUser((user: UserType, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        }) as UserType;
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id }
                });

                if (!user) {
                    // Create new user
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails![0].value,
                            name: profile.displayName,
                        },
                    });
                }

                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);