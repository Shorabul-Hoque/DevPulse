```markdown
# 🚀 DevPulse - Issue & Bug Tracking REST API

DevPulse is a secure, modular, and high-performance issue and bug tracking REST API. Built with Node.js, Express, and TypeScript, it utilizes raw PostgreSQL queries to ensure maximum speed and complete control over the database layer.

---

## 🔗 Important Links

- **Live API URL:** [https://dev-pulse-nine-weld.vercel.app](https://dev-pulse-nine-weld.vercel.app)
- **GitHub Repository:** [https://github.com/Shorabul-Hoque/DevPulse](https://github.com/Shorabul-Hoque/DevPulse)
- **Technical Interview Video:** [Google Drive Link](https://drive.google.com/file/d/1-nIzmLt5coGYyQPb_XG54E0UQTIll5CY/view?usp=sharing)

---

## 🛠️ Tech Stack & Features

- **Runtime & Framework:** Node.js, Express (v5.2.1)
- **Language:** TypeScript with ESM (`"type": "module"`)
- **Database:** PostgreSQL (Raw SQL queries using `pg` pool)
- **Authentication:** JWT (JsonWebToken) & Password Hashing via `bcrypt`
- **Build Tool:** `tsup` for fast TypeScript compilation
- **Development Tool:** `tsx watch` for hot-reloading

### Key Features:
* **Centralized Error Handling:** Safely catches both synchronous and asynchronous errors using a uniform 4-argument global middleware.
* **Database Connection Pooling:** Optimized database performance using PostgreSQL client pooling.
* **Auto Database Initialization:** Automatically creates `users` and `issues` tables on startup if they do not exist.
* **Secure AuthGuard:** Middleware to protect private routes using JWT verification.

---

## 📂 Project Structure

```text
📦src
 ┣ 📂config
 ┃ ┗ 📜index.ts
 ┣ 📂db
 ┃ ┗ 📜index.ts
 ┣ 📂middleware
 ┃ ┣ 📜auth.ts
 ┃ ┣ 📜globalErrorHandler.ts
 ┃ ┗ 📜logger.ts
 ┣ 📂modules
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.route.ts
 ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┗ 📂issue
 ┃ ┃ ┣ 📜issue.controller.ts
 ┃ ┃ ┣ 📜issue.route.ts
 ┃ ┃ ┗ 📜issue.service.ts
 ┣ 📂types
 ┃ ┗ 📜index.ts
 ┣ 📂utility
 ┃ ┗ 📜sendResponse.ts
 ┣ 📜app.ts
 ┗ 📜server.ts

```

---

## 🚀 Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository

```bash
git clone [https://github.com/Shorabul-Hoque/DevPulse.git](https://github.com/Shorabul-Hoque/DevPulse.git)
cd DevPulse

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add your configurations:

```env
PORT=5000
DATABASE_CONNECTION_URL=postgresql://postgres:your_local_password@localhost:5432/devpulse_db
SALT_ROUNDS=10
JWT_SECRET=super_secret_devpulse_key

```

*(Note: Create the database `devpulse_db` in your local PostgreSQL instance before running).*

### 4. Run the Project

* **Development Mode:**

```bash
npm run dev

```

* **Build Project:**

```bash
npm run build

```

* **Production Mode:**

```bash
npm start

```

---

## 🎯 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Login user & get Token | ❌ No |

### 🐛 Issue Management

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/issues` | Create a new issue | 🔑 Yes (Bearer Token) |
| `GET` | `/api/issues` | Get all issues | 🔑 Yes (Bearer Token) |
| `GET` | `/api/issues/:id` | Get specific issue by ID | 🔑 Yes (Bearer Token) |
| `PUT` | `/api/issues/:id` | Update an issue by ID | 🔑 Yes (Bearer Token) |
| `DELETE` | `/api/issues/:id` | Delete an issue by ID | 🔑 Yes (Bearer Token) |

---

Developed with ❤️ by **Shorabul Hoque**.