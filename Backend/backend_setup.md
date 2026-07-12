# AssetFlow Backend Setup Guide

This guide contains everything you need to get the Node.js / Express backend and SQLite database up and running locally for AssetFlow.

## Prerequisites
- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)

## 1. Install Dependencies
Navigate into this folder (`Backend`) and install all required packages:
```bash
npm install
```

## 2. Environment Variables
Create a file named `.env` in the `Backend` directory and add the following configuration:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
```
This points Prisma to our local SQLite database and tells Express to run on port 5000.

## 3. Database Initialization
We are using Prisma ORM with SQLite. To sync the database schema and generate the client, run:
```bash
npx prisma db push
```
*(If you face client issues later, you can explicitly run `npx prisma generate`)*

## 4. Seed the Database
To populate the database with mock data (assets, employees, logs, notifications, bookings, etc.), run the seed scripts in order:

```bash
# Seed Departments, Categories, and Employees
node seed.js

# Seed Mock Assets
node seedAssets.js

# Seed all other dynamic modules and setup the Admin user
node seedData.js
```

### Note on Admin Access
The `seedData.js` script provisions a default Admin user so you can access all protected frontend routes (like Organization Setup).
- **Email:** `admin@yaksha.com`
- **Password:** `admin`

## 5. Start the Server
Start the development server with:
```bash
npm start
```
The backend will run on `http://localhost:5000`. 
*(Note: If you make changes to `server.js`, you'll need to manually restart the server unless you run it with `nodemon`).*

## API Architecture
- `/api/auth/*` - Handles login/signup.
- `/api/assets` - Asset registry CRUD.
- `/api/allocations` & `/api/transfers` - Allocation conflicts and transfer routes.
- `/api/bookings` - Shared resource reservation system.
- `/api/maintenance` - Asset repair tickets.
- `/api/logs` & `/api/notifications` - Timely activity logs for the Home Dashboard.
