import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres', 
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("PostgreSQL connection error:", err));

export default pool;
