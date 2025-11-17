import cookiesParser from 'cookie-parser';
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascota.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });


const app = express();              // 2. Inicializar la app
const PORT = 8000;                  // 3. Definir el puerto
const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI no está definido en las variables de entorno.');
}

// Middleware
app.use(express.json());
app.use(cookiesParser());
app.use("/api", authRoutes);
app.use("/api", mascotasRoutes);
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando y conectado a MongoDB!');
});

async function run() {
  try {
    // Conectar Mongoose a MongoDB
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Mongoose conectado a MongoDB exitosamente!");

    // Inicializar el servidor SOLO después de que la conexión a MongoDB sea exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error de conexión a MongoDB o al iniciar servidor:", error);
    // Nota: Es común NO cerrar el cliente aquí si el servidor se va a mantener abierto.
    // Solo lo cerramos si hay un error de conexión inicial.
    await client.close();
  }
}
run().catch(console.dir);