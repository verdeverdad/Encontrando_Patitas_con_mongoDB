import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import User from '../models/user.models.js';

export const register = async (req, res) => {  //funcion asincrona para registrar

    try {

        const { username, email, password, phone } = req.body

        //encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({ //intenta hacer un nuevo usuario 
            username,
            email,
            password: passwordHash, //la contraseña tiene como valor el hash
            phone
        });

        const userSaved = await newUser.save(); //y guardar el usuario en la base de datos
        const token = await createAccessToken({ id: userSaved._id }) //crear token con el id del usuario guardado
        res.cookie('token', token); //guardar el token en una cookie
        //datos que voy a usar en el frontend
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            phone: userSaved.phone
        });
        console.log(newUser);

    } catch (error) { //sino error
        res.status(500).json({ message: error.message });
    }


}

export const login = async (req, res) => {  //funcion asincrona para registrar

    try {

        const { password, email } = req.body

        const userFound = await User.findOne({ email }); //buscar el usuario por email

        if (!userFound)
            return res.status(400).json({ message: "Usuario no encontrado" }); //si no lo encuentra error

        const isMatch = await bcrypt.compare(password, userFound.password); //comparar la contraseña ingresada con la guardada
        if (!isMatch)
            return res.status(400).json({ message: "Contraseña incorrecta" }); //si no coincide error


        const token = await createAccessToken({ id: userFound._id }) //crear token con el id del usuario guardado
        res.cookie('token', token); //guardar el token en una cookie
        //datos que voy a usar en el frontend
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        });
    } catch (error) { //sino error
        res.status(500).json({ message: error.message });
    }

}

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
    })
}