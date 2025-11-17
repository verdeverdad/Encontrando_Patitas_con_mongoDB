import Mascota from "../models/mascota.model.js";

export const getMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({ user : req.user.id }).populate("user"); //solo las mascotas del usuario autenticado
    res.json(mascotas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createMascota = async (req, res) => { //crear una mascota
  try {
    const { title, description, date } = req.body;
    const newMascota = new Mascota({
      title,
      description,
      date,
      user: req.user.id, // Asignar el ID del usuario autenticado
    });
    await newMascota.save();
    res.json(newMascota);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMascota = async (req, res) => {
  try {
    const deletedMascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!deletedMascota)
      return res.status(404).json({ message: "Mascota not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMascota = async (req, res) => { //actualizar una mascota
  try {
    const { title, description, date } = req.body;
    const mascotaUpdated = await Mascota.findOneAndUpdate(
      { _id: req.params.id },
      { title, description, date },
      { new: true } // para retornar el documento actualizado
    );
    return res.json(mascotaUpdated);
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