import * as z from "zod";

const PHONE_REGEX = /^(09)\d{7}$/;

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
  phone: z
    .string({
      required_error: "El número de teléfono es obligatorio",
    })
    .min(9, "El teléfono debe tener exactamente 9 dígitos")
    .max(9, "El teléfono debe tener exactamente 9 dígitos")
    .regex(PHONE_REGEX, "El formato de teléfono es incorrecto. Debe comenzar con '09' y tener 9 dígitos (ej: 091234567)"),
    
});

export const loginSchema = z.object({
  email: z.email("Dirección de correo electrónico inválida"),
  password: z.string().min(6, { message: "la contraseña tiene un minimo de 6 caracteras" }),
});