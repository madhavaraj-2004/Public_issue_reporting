# Server

Setup and run instructions for the Express API.

Environment (.env):
- `PORT` (default 5000)
- `MONGO_URI` (mongodb connection)
- `JWT_SECRET`
- `SEED_ADMIN_EMAIL` (optional)
- `SEED_ADMIN_PASSWORD` (optional)

Install and run:

```powershell
cd server
npm install
npm run dev
```

Create an admin user:

```powershell
cd server
node utils/seedAdmin.js
```
