import express from 'express';
import authController from '../controllers/auth.controller';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

router.get('/login', authController.login);
router.get('/callback', catchAsync( authController.spotifyCallback ));
router.get('/refresh', catchAsync( authController.refreshSpotifyToken ));

export default router;