import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {  //requiere los tres parametros para ser middelware, se ejecuta antes de entrar a la ruta
    const { token } = req.cookies;

    if (!token)
        return res.status(401).json({ message: 'No autorizado, token no proporcionado' });

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        
        console.log(decoded)
        req.user = decoded;
        next();
    });
}