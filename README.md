# PetshopLife

Projeto simples em **Node.js + Express + MongoDB (Mongoose)** com front-end estático (HTML/CSS/JS).

## 🚀 Como iniciar

### 1) Subir o banco (Docker)
> Requer `docker` e `docker compose`.

```bash
docker compose up -d
```

- **MongoDB**: `localhost:27017`
- **mongo-express** (GUI opcional): `http://localhost:8081`  
  > Credenciais conforme teu `docker-compose.yml`.

### 2) Instalar dependências (Node)
```bash
npm install
```

### 3) Rodar a aplicação
```bash
npm start
```

- App disponível em: **http://localhost:8000/**

---

## 🌐 Endpoints principais

- `GET /` → carrega `public/user_selection.html`
- `GET /users` → carrega `public/new_user.html`
- `POST /users` → cria novo usuário no MongoDB

> Dica: após criar um usuário, você consegue ver a collection `users` no **mongo-express**.

---

## 🗂️ Estrutura de pastas

```
petshoplife/
├─ public/                       # Front-end exposto (arquivos estáticos)
|  ├─ booking.html
|  ├─ index.html
|  ├─ new_user.html
|  ├─ slots.html
│  ├─ user_selection.html
│  ├─ user.html
│  └─ styles.css
│
├─ src/
│  ├─ config/
│  │  └─ connection.js           # Conexão com MongoDB via Mongoose
│  ├─ model/
│  │  └─ user.js                 # Schema/Model Mongoose (User)
│  └─ routes/
│     └─ users.routes.js         # Rotas /users (GET página, POST criação)
│
├─ index.js                      # Entry point (Express, static, routers, listen)
├─ docker-compose.yml            # Mongo + mongo-express
└─ package.json                  # Scripts npm
```

### Papel de cada parte

- **`public/`**: HTML/CSS/JS do navegador. Servido com `express.static(...)`.
- **`src/config/connection.js`**: faz `mongoose.connect(...)`.  
  - Recomenda-se usar variável: `MONGODB_URI`
  - Exemplo (com auth do compose):  
    `mongodb://root:root@localhost:27017/petshop?authSource=admin`
- **`src/model/user.js`**: define o schema `User` e exporta o model.
- **`src/routes/users.routes.js`**: rotas `GET /users` (página) e `POST /users` (inserção).
- **`index.js`**: instancia o Express, aplica middlewares, serve `public/`, monta `app.use("/users", usersRouter)` e dá `listen`.

---

## 🧰 Comandos úteis (Docker)

- Ver containers:
  ```bash
  docker ps
  ```
- Entrar no shell do Mongo:
  ```bash
  docker compose exec mongo mongosh -u root -p root --authenticationDatabase admin
  ```
  E dentro:
  ```javascript
  use petshop
  show collections
  db.users.find()
  ```

---

Pronto! É só seguir a ordem **docker compose up -d → npm install → npm start → acessar http://localhost:8000**.
