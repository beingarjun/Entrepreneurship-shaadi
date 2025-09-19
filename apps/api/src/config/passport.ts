import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedUser } from '@/utils/auth';

const prisma = new PrismaClient();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const googleId = profile.id;

    if (!email) {
      return done(new Error('No email found in Google profile'), undefined);
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          isVerified: true, // Google accounts are considered verified
          password: '', // No password for OAuth users
        }
      });
    }

    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };

    return done(null, authUser);
  } catch (error) {
    return done(error, undefined);
  }
}));

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key'
}, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true
      }
    });

    if (user) {
      const authUser: AuthenticatedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      };
      return done(null, authUser);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true
      }
    });

    if (user) {
      const authUser: AuthenticatedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      };
      done(null, authUser);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

export default passport;