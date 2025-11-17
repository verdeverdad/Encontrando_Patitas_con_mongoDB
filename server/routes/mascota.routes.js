import { Router } from "express";
import {
  createMascota,
  deleteMascota,
  getMascota,
  getMascotas,
  updateMascota,
} from "../controllers/mascota.controllers.js";
import { authRequired } from "../middlewares/validateTokens.js";

const router = Router();

router.get("/mascotas", authRequired, getMascotas); //obtener 
router.post("/mascotas", authRequired, createMascota);//crear
router.get("/mascotas/:id", authRequired, getMascota);//obtener uno solo
router.put("/mascotas/:id", authRequired, updateMascota);//actualizar uno
router.delete("/mascotas/:id", authRequired, deleteMascota);//eliminar uno

export default router;