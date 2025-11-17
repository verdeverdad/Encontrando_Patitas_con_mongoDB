import { Router } from "express";
import {
  createMascota,
  deleteMascota,
  getMascota,
  getMascotas,
  updateMascota,
} from "../controllers/mascota.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authRequired } from "../middlewares/validateTokens.js";

const router = Router();

router.get("/mascotas", auth, getMascotas); //obtener 
router.post("/mascotas", auth, authRequired, createMascota);//crear
router.get("/mascotas/:id", auth, getMascota);//obtener uno solo
router.put("/mascotas/:id", auth, authRequired, updateMascota);//actualizar uno
router.delete("/mascotas/:id", auth, authRequired, deleteMascota);//eliminar uno

export default router;