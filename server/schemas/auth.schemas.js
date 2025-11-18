import { error } from "console";
import * as z from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "El nombre de usuario es obligatorio",
  }),
  email: z
    .email("Dirección de correo electrónico inválida"),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "la contraseña tiene un minimo de 6 caracteras",
    }),
  });
  console.log(error.message)

export const loginSchema = z.object({
  email: z.string().email("Dirección de correo electrónico inválida"),
  password: z.string().min(6, { message: "la contraseña tiene un minimo de 6 caracteras" }),
});