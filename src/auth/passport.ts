import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../config/prisma';

// Define the shape of the user object we pass in done()
interface IGoogleUser {
  id: string;
  email: string;
  role: string;
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy_client_id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret';
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Upsert the user into PostgreSQL. 
        // Fans log in via Google OAuth.
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // If no user by googleId, check by email first to avoid unique constraint violation
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link googleId to existing user
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id },
            });
          } else {
            // Create new FAN user
            user = await prisma.user.create({
              data: {
                email,
                googleId: profile.id,
                role: 'FAN',
              },
            });
          }
        }

        const authUser: IGoogleUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        return done(null, authUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

export default passport;
