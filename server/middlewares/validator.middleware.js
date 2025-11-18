import { ZodError } from 'zod'; // Importamos tipos de Zod

// Función de orden superior que devuelve el middleware
// Recibe el esquema a validar (registerSchema, loginSchema, etc.)
export const validateSchema = (schema) => 
    (req, res, next) => {
        
    try {
        // Intenta validar el body de la petición
        // Esto lanzará un error si falla, saltando al catch.
        schema.parse(req.body);
        next();
    } catch (error) {
        
        // Si la validación falla, el error es una instancia de ZodError
        if (error instanceof ZodError) {
            
            // CORRECCIÓN: Usamos error.issues.map(...)
            // issues es el array donde Zod guarda todos los fallos.
            const validationErrors = error.issues.map((issue) => ({
                path: issue.path,        // Campo que falló (ej: ['email'])
                message: issue.message,  // Mensaje de error (ej: "Invalid email address")
            }));

            // Devolver una respuesta 400 con la lista de errores
            return res.status(400).json(validationErrors);
        }
        
        // Si es otro tipo de error, lo manejamos genéricamente
        return res.status(500).json({ message: "Error interno en la validación." });
    }
};