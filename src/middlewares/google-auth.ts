//  middlewares/google-auth.ts

import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import prisma from '../db';
import { UserType } from '../types';

interface RequestWithUser extends Request{
    user?: UserType
}

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
});


export const isAuthenticated = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.isAuthenticated()) {
            next();
            return;
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Authorization header missing or invalid format'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {   

            const tokenInfo = await client.getTokenInfo(token);
            const user = await prisma.user.findFirst({
                where: { email: tokenInfo.email }
            });

            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
                return;
            }

            
            req.user = user;
            console.log("authorizing user : ",req.user.role)
            next();
            return;

        } catch (tokenError) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
            return;
        }

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Authentication error'
        });
        return;
    }
};

const getOAuth2Client = () => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    return oAuth2Client;
};

// Function to generate Google Meet link
export const createGoogleMeetLink = async (
    title: string,
    description: string,
    startTime: string,
    endTime: string
): Promise<string> => {
    try {
        const auth = getOAuth2Client();
        const calendar = google.calendar({ version: 'v3', auth });

        const event = {
            summary: title,
            description: description,
            start: {
                dateTime: startTime, // ISO 8601 format
                timeZone: 'UTC',
            },
            end: {
                dateTime: endTime, // ISO 8601 format
                timeZone: 'UTC',
            },
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`, // Unique request ID
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            conferenceDataVersion: 1,
        });

        return response.data?.hangoutLink || '';
    } catch (error) {
        console.error('Error creating Google Meet link:', error);
        throw new Error('Failed to create Google Meet link');
    }
};