import { z } from "zod";

export const createMascotaSchema = z.object({
  title: z.string({ required_error: "El título es obligatorio" }),
  description: z.string({ required_error: "La descripción es necesaria" }),
  sexo: z.enum(["Macho", "Hembra", "No sabe"]).optional(),
  edad: z.number().optional(),
  localidad: z.string(),
  traslado: z.string().optional(),
  image: z.string().optional(),
categoria: z.enum(["Perdido", "Encontrado", "En Adopción"], {
  required_error: "Selecciona una opción",
  invalid_type_error: "Esa categoría no es válida",
}),  usuarioNombre: z.string({ required_error: "Tu nombre es obligatorio" }),
  usuarioTelefono: z.string().optional(),
  date: z.string().datetime().optional(), // Por si querés mandar una fecha manual
});