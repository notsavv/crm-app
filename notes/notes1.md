# CRM Application Development Summary (NOTE 1)
- Usage of Docker, Setting up a database

## 1. Project Structure and Organization:

### Backend Setup:
- I’m creating a CRM application with a backend using Express.js and PostgreSQL.
- For better structure and maintainability, I’ve kept different concerns in separate folders and files.

### Environment Variables (`.env`):
- I store sensitive information (like database credentials, port numbers, etc.) in a `.env` file for security and flexibility.
- I use **`dotenv`** to load the variables from `.env` into `process.env`.
    ```javascript
    import dotenv from 'dotenv';
    dotenv.config();
    const PORT = process.env.PORT || 5000;
    ```

## 2. PostgreSQL Setup:

### Setting up PostgreSQL Database:
- I used **Docker** to spin up a PostgreSQL container, which helps me manage and deploy my database without installing anything on my local machine.
- In the Docker `docker-compose.yml` file, I set up the PostgreSQL container with this configuration:
    ```yaml
    version: "3.9"
    services:
      db:
        image: postgres
        container_name: crm-db
        environment:
          POSTGRES_USER: user
          POSTGRES_PASSWORD: password
          POSTGRES_DB: crm_db
        ports:
          - "5433:5432"  # Expose 5433 to the host
        volumes:
          - postgres_data:/var/lib/postgresql/data
    volumes:
      postgres_data:
    ```

### pgAdmin (Optional):
- I considered using **pgAdmin** for managing my PostgreSQL database schema and tables, but could also use Docker for this.

## 3. Docker Setup and Networking:

### Creating Docker Network:
- I created a Docker network so that my backend and database containers can communicate with each other. This network allows for easier interaction between my services.

### Docker Compose:
- I used Docker Compose to manage my services, especially the PostgreSQL database, which simplifies starting and managing the containers.

## 4. PostgreSQL Client (`pg`) Setup:

### Installing `pg` Module:
- I installed the **`pg`** (PostgreSQL) module using npm to interact with my PostgreSQL database.
    ```bash
    npm install pg
    ```

### Connecting to the Database:
- I created a `db.js` file where I set up the connection to the database using the `pg` Pool, which efficiently handles database connections through pooling.
    **Connection Example**:
    ```javascript
    import { Pool } from 'pg';
    const pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });

    const connectDb = async () => {
      try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL!");
        client.release();
      } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1);
      }
    };

    export { pool, connectDb };
    ```

### Graceful Shutdown:
- I added graceful shutdown functionality to ensure that connections are properly closed when the application is stopped (e.g., on `SIGINT` signal when I press `Ctrl+C`).
    Example of shutting down the connection pool:
    ```javascript
    process.on('SIGINT', () => {
      console.log("Closing PostgreSQL connection...");
      pool.end(() => {
        console.log("PostgreSQL connection closed.");
        process.exit(0);
      });
    });
    ```

## 5. Dockerized PostgreSQL and Backend Setup:

### Database Credentials in `.env`:
- I stored credentials like `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `PG_PORT` in a `.env` file for security and flexibility.

### Docker Networking:
- I ensured that both the backend and database containers are part of the same Docker network so they can communicate seamlessly.

### Port Mapping:
- I mapped the Docker PostgreSQL container’s internal port (5432) to an external port (5433) to allow access from my local machine.

## 6. Troubleshooting:

### Address Already in Use:
- I encountered an error related to the database port being already in use. To solve this, I used `lsof -i :5432` to check if the port was occupied, and I opted to use a different port (5433).

### Checking Installed npm Modules:
- I used the `npm list` and `npm list --depth=0` commands to check which npm modules I’ve installed in my project.

---

## Key Points for Future Reference:

- **Separation of Concerns**: I’ve kept my connection logic (e.g., `db.js`) separate from my main application code (`index.js`) for better organization.
- **Connection Pooling**: I use connection pooling to efficiently manage and reuse database connections, which helps improve performance.
- **Dockerize My Application**: I’m using Docker to run the backend and database in separate containers, allowing for better isolation and easier deployment.
- **Graceful Shutdown**: I’ve ensured that the database connections are properly released when the app shuts down.
- **.env File**: I use the `.env` file for storing sensitive information and credentials securely.
