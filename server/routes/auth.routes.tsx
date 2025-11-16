import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.contoller';

const router = Router();

router.post('/register', registerUser);
  // Lógica para registrar un usuario


router.post('/login', loginUser);
  // Lógica para iniciar sesión


export default router;