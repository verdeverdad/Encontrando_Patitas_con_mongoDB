import mongoose from "mongoose";

const mascotaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es necesaria"],
    },
    // Nuevos campos basados en tu interface:
    sexo: {
      type: String,
      enum: ["Macho", "Hembra", "No sabe"], // Evita errores de escritura
      default: "No sabe",
    },
    edad: {
      type: Number,
      min: 0,
    },
    localidad: {
      type: String,
      required: [true, "La localidad es clave para encontrar patitas"],
    },
    traslado: {
      type: String, // "Sí", "No", "A coordinar"
      default: "No",
    },
    image: {
      type: String, // Aquí va la URL de Cloudinary o Firebase Storage
      default: "https://via.placeholder.com/150",
    },
    categoria: { 
      type: String, 
      enum: ["Perdido", "Encontrado", "En Adopción"],
      required: true 
    },
    // Datos de contacto (pueden venir del User, pero es mejor tenerlos a mano)
    usuarioNombre: {
      type: String,
      required: true,
    },
    usuarioTelefono: {
      type: String,
    },
    // Relación con el usuario
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Esto ya crea 'createdAt' (que sería tu fechaPublicacion) y 'updatedAt'
  }
);

// Especificar el nombre de la colección
const Mascota = mongoose.model('Mascota', mascotaSchema, 'Mascotas');

export default Mascota;