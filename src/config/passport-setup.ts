// config/passport-setup.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db';
import { UserType, UserWithToken } from '../types/index';
import { UserRole } from '@prisma/client';

passport.serializeUser((user: UserType, done) => {
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        console.log({ user });
        done(null, user as UserType);
    } catch (error) {
        done(error, null);
    }
});

// 'http://localhost:5000/auth/google/callback'

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
            passReqToCallback: true
        },
        async (_req, accessToken, refreshToken, profile, done) => {


            try {
                let user = await prisma.user.findFirst({
                    where: { googleId: profile.id }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails?.[0].value || '',
                            name: profile.displayName,
                            role: UserRole.user,
                            profilePicture: profile._json.picture || null
                        },
                    });
                }

                const userWithToken: UserWithToken = {
                    ...user,
                    accessToken,
                    refreshToken
                };

                return done(null, userWithToken);

            } catch (error) {
                console.error('Google Strategy Error:', error);
                return done(error);
            }
        }
    )
);

export default passport;