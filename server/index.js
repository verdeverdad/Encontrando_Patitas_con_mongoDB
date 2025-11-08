require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express'); // 1. Importar Express
const app = express();              // 2. Inicializar la app
const PORT = 8000;                  // 3. Definir el puerto

const uri = process.env.MONGO_URI;

// Comprobación de seguridad (opcional, pero buena práctica)
if (!uri) {
    throw new Error('MONGO_URI no está definido en las variables de entorno.');
}

// Crear un MongoClient con un objeto MongoClientOptions para establecer la versión de Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Conectar el cliente al servidor
    await client.connect(); 
    
    // Enviar un ping para confirmar una conexión exitosa
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");

    // --- Lógica del Servidor Express ---

    // Middleware de ejemplo (opcional, para peticiones JSON)
    app.use(express.json()); 

    // 5. Ruta de prueba (Endpoint de ejemplo)
    app.get('/', (req, res) => {
      res.send('Servidor Express funcionando y conectado a MongoDB!');
    });

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