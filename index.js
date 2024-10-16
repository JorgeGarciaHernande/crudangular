const express = require('express'); // Framework para crear el servidor
const cors = require('cors'); // Permite peticiones desde otros dominios (Angular)
const { Pool } = require('pg'); // Librería para conectar con PostgreSQL

const app = express(); // Inicializamos la aplicación Express
app.use(cors()); // Habilitamos CORS
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuramos la conexión con PostgreSQL usando DATABASE_URL de Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Railway
  },
});

// Endpoint: Obtener todos los nombres
app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT nombre FROM nombres');
    res.json(result.rows.map(row => row.nombre));
  } catch (err) {
    console.error('Error al obtener nombres:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint: Agregar un nombre
app.post('/names', async (req, res) => {
  const { nombre } = req.body;
  try {
    await pool.query('INSERT INTO nombres (nombre) VALUES ($1)', [nombre]);
    res.sendStatus(201); // Código 201: Creado exitosamente
  } catch (err) {
    console.error('Error al agregar nombre:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint: Eliminar un nombre
app.delete('/names/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    await pool.query('DELETE FROM nombres WHERE nombre = $1', [nombre]);
    res.sendStatus(204); // Código 204: Eliminado exitosamente
  } catch (err) {
    console.error('Error al eliminar nombre:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Iniciamos el servidor en el puerto 3000 o el que asigne Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
