import { Schema, model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    telefono: string; // Como hablamos, es mejor string para números de teléfono
    password: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefono: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
});

export default model('User', userSchema);