## Continuation of My Project – Expanding the Backend & Fixing PostgreSQL Connection Issues  

While working on this project, I encountered and resolved several issues related to **PostgreSQL connectivity**, **Docker networking**, and **environment variable management**. Below is a summary of all the debugging steps I took and the final fix that solved the issue.

---

### PostgreSQL Not Resolving Inside Docker  
When I first ran `node index.js`, I encountered the following error:  
```sh
Error: getaddrinfo ENOTFOUND postgres
```
**Cause:**  
- The backend was running outside Docker and couldn't resolve the `postgres` hostname.  

**Fix:**  
- Ensured the backend was running inside Docker:  
  ```sh
  docker-compose up --build -d
  ```
- Verified if the backend was connected to the correct Docker network:  
  ```sh
  docker network inspect crm-network
  ```
- Since the backend container was missing from the network, I manually connected it:  
  ```sh
  docker network connect crm-network node_backend
  ```

---

### Port 5432 Already in Use  
When I tried running `docker-compose up`, I encountered this issue:  
```sh
Ports are not available: exposing port TCP 0.0.0.0:5432 -> 127.0.0.1:0
```
**Cause:**  
- PostgreSQL was already running outside Docker on port **5432**, causing a conflict.  

**Fix:**  
- Identified the process using port **5432**:  
  ```sh
  sudo lsof -i :5432
  ```
- Stopped the local PostgreSQL service:  
  ```sh
  brew services stop postgresql
  ```
- Restarted Docker to ensure PostgreSQL inside the container could bind to port 5432:  
  ```sh
  docker-compose down
  docker-compose up --build -d
  ```

---

### Backend Could Not Connect to PostgreSQL (`no PostgreSQL user name specified in startup packet`)  
After starting the backend container successfully, I saw this error in the logs:  
```sh
PostgreSQL connection error: error: no PostgreSQL user name specified in startup packet
```
**Cause:**  
- The environment variables were not being loaded correctly inside the backend container.  

**Fix:**  
- Confirmed whether the backend container had the correct environment variables:  
  ```sh
  docker exec -it node_backend env | grep POSTGRES
  ```
- Since the variables were missing, I explicitly passed them in `docker-compose.yml`:  
  ```yaml
  backend:
    environment:
      - PORT=3000
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=adminpassword
      - POSTGRES_DB=crm_db
  ```
- Restarted everything to apply the changes:  
  ```sh
  docker-compose down
  docker-compose up --build -d
  ```

---

### PostgreSQL Not Reachable from the Backend  
Even after fixing the environment variables, the backend still couldn't connect to PostgreSQL.  

**Cause:**  
- The backend container couldn't communicate with `postgres` inside Docker's network.  

**Fix:**  
- Checked whether PostgreSQL was resolvable from inside the backend container:  
  ```sh
  docker exec -it node_backend nslookup postgres
  ```
- Since no IP address was returned, I manually connected the containers to the network:  
  ```sh
  docker network connect crm-network postgres_db
  docker network connect crm-network node_backend
  ```
- Verified the fix by testing the PostgreSQL connection manually from inside the backend container:  
  ```sh
  docker exec -it node_backend psql -h postgres -U admin -d crm_db
  ```

---

### The Backend Server Was Running, but `curl http://localhost:3000` Failed  
Even after fixing the database connection, I still couldn't access the backend.  

**Cause:**  
- The backend container was running, but it wasn't correctly exposing port **3000**.  

**Fix:**  
- Checked if the backend container was actually listening on port 3000:  
  ```sh
  docker exec -it node_backend netstat -tulnp
  ```
- Since the container wasn't exposing **0.0.0.0:3000**, I fixed `docker-compose.yml`:  
  ```yaml
  backend:
    ports:
      - "3000:3000"
  ```
- Restarted the backend:  
  ```sh
  docker-compose restart backend
  ```
- Verified the fix by testing the API from inside the container:  
  ```sh
  docker exec -it node_backend curl http://localhost:3000
  ```

---

## Final Fix That Solved Everything  
After several debugging steps, the main fix that worked was:  

- Ensuring the backend runs **inside Docker** instead of locally:  
  ```sh
  docker-compose up --build -d
  ```
- Making sure PostgreSQL was not running **outside Docker**, to avoid port conflicts.  
- Explicitly passing **environment variables** inside `docker-compose.yml` instead of relying on `.env`.  
- Checking if `postgres` was **resolvable from inside the container**:  
  ```sh
  docker exec -it node_backend nslookup postgres
  ```
- Verifying PostgreSQL **connectivity manually**:  
  ```sh
  docker exec -it node_backend psql -h postgres -U admin -d crm_db
  ```
- Ensuring the backend container **was correctly listening on port 3000**.  

After implementing these changes, the API is now running successfully at:  
```
http://localhost:3000
```

