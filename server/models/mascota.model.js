import mongoose from "mongoose";

const mascotaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Especificar el nombre de la colección
const Mascota = mongoose.model('Mascota', mascotaSchema, 'Mascotas');

export default Mascota;