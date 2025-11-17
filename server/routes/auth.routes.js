import { Router } from 'express';
import { login, logout, profile, register } from '../controllers/auth.contoller.js';
import { authRequired } from '../middlewares/validateTokens.js';

const router = Router();

router.post('/register', register);
  // Lógica para registrar un usuario


router.post('/login', login);
  // Lógica para iniciar sesión


router.post('/logout', logout);
  // Lógica para cerrar sesión

router.get('/profile', authRequired, profile);

export default router;