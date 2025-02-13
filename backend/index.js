import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT

app.use(express.json());


app.get('/', (req, res) => {
  res.send('server is running...');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).send('Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
