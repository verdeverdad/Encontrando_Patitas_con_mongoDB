import * as z from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "El nombre de usuario es obligatorio",
  }),
  email: z.string().email("Dirección de correo electrónico inválida"),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "La contraseña tiene un mínimo de 6 caracteres",
    }),
  phone: z
    .string({
      required_error: "El número de teléfono es obligatorio",
    })
    .min(9, "El teléfono debe tener exactamente 9 dígitos")
    .max(9, "El teléfono debe tener exactamente 9 dígitos")
    .regex(/^(09)\d{7}$/, "El formato de teléfono es incorrecto. Debe comenzar con '09' y tener 9 dígitos"),
});

export const loginSchema = z.object({
  email: z.string().email("Dirección de correo electrónico inválida"),
  password: z.string().min(6, { message: "La contraseña tiene un mínimo de 6 caracteres" }),
});
