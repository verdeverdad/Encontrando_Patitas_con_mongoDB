import Mascota from "../models/mascota.model.js";

// OBTENER TODAS LAS MASCOTAS PÚBLICAS
export const getAllMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({});
    res.json(mascotas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// OBTENER TODAS LAS MASCOTAS DEL USUARIO (Para su perfil)
export const getMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({ user: req.user.id }).populate("user");
    res.json(mascotas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CREAR UNA PUBLICACIÓN COMPLETA
export const createMascota = async (req, res) => {
  try {
    const {
      title, description, sexo, edad, localidad,
      traslado, image, categoria, usuarioNombre, usuarioTelefono, date
    } = req.body;

    const newMascota = new Mascota({
      title,
      description,
      sexo,
      edad,
      localidad,
      traslado,
      image,
      categoria,
      usuarioNombre,
      usuarioTelefono,
      date,
      user: req.user.id,
    });

    const savedMascota = await newMascota.save();
    res.json(savedMascota);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ACTUALIZAR UNA PUBLICACIÓN (Incluyendo todos los campos nuevos)
export const updateMascota = async (req, res) => {
  try {
    // Extraemos todo lo que puede venir del frontend
    const updateData = req.body;

    const mascotaUpdated = await Mascota.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Seguridad: Solo el dueño puede editar
      updateData,
      { new: true }
    );

    if (!mascotaUpdated) return res.status(404).json({ message: "Mascota no encontrada o no tenés permiso" });
    return res.json(mascotaUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMascota = async (req, res) => {
  try {
    const deletedMascota = await Mascota.findOneAndDelete({ _id: req.params.id, user: req.user.id });  // Agrega verificación de propietario
    if (!deletedMascota)
      return res.status(404).json({ message: "Mascota not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMascota = async (req, res) => { //obtener una mascota por id
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ message: "Mascota not found" });
    return res.json(mascota);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};