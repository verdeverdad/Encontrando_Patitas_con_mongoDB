import { Router } from 'express';
import { login, logout, profile, register, updateProfile } from '../controllers/auth.contoller.js';
import { authRequired } from '../middlewares/validateTokens.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
  // Lógica para registrar un usuario


router.post('/login', validateSchema(loginSchema), login);
  // Lógica para iniciar sesión


router.post('/logout', logout);
  // Lógica para cerrar sesión

router.get('/profile', authRequired, profile);

router.put('/profile', authRequired, updateProfile); 

export default router;