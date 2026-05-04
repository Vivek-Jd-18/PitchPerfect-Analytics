import { Router } from 'express';
import passport from 'passport';
import { adminLogin, googleAuthCallback } from '../controllers/auth.controller';

const router = Router();

// ==========================================
// ADMIN Authentication (Strict JWT)
// ==========================================
router.post('/login/admin', adminLogin);

// ==========================================
// FAN Authentication (Google OAuth)
// ==========================================

// Initiates the Google OAuth flow
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback URL for Google OAuth
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

export default router;
