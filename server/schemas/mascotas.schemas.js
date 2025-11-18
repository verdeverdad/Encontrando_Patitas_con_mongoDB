import * as z from "zod";

export const createMascotaSchema = z.object({
    title: z.string({
        required_error: "El nombre de la mascota es obligatorio"
    }),
    description: z.string({
        required_error: "La descripcion de la mascota es opcional"
    }).optional(),
    date: z.string().datetime().optional(),
});