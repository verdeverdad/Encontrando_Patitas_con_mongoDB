import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, //limpia espacios en blanco
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
      perfilImage: { 
        type: String,
        // URL por defecto si el usuario no sube ninguna
        default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Especificar el nombre de la colección
const User = mongoose.model('User', userSchema, 'Usuarios');

export default User;