# FuelEU Maritime Compliance Platform

A full-stack application for managing FuelEU Maritime compliance, including route management, compliance calculations, banking, and pooling mechanisms.

## 📋 Project Overview

This platform helps shipping companies comply with EU regulations for reducing greenhouse gas emissions from maritime transport. It includes:

- **Route Management**: Track vessel routes, fuel consumption, and emissions
- **Compliance Comparison**: Compare routes against baseline and regulatory targets
- **Banking System**: Store surplus compliance balance for future use
- **Pooling System**: Share compliance balance between multiple ships

## 🏗️ Architecture

The project uses **Hexagonal Architecture** (Ports & Adapters pattern):

- **Core Layer**: Business logic and domain models (no external dependencies)
- **Application Layer**: Use cases that orchestrate business operations
- **Adapters Layer**: HTTP controllers (backend) and UI components (frontend)
- **Infrastructure Layer**: Database and server configuration

This separation makes the code:
- Easy to test
- Easy to maintain
- Easy to swap technologies (e.g., change database or UI framework)

## 🛠️ Technology Stack

### Backend
- **Node.js** with TypeScript
- **Express** for REST API
- **PostgreSQL** for database
- **Prisma** as database ORM

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file with your database connection:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/fueleu_maritime"   (change it with your postgresql URL)
   PORT=3001
   NODE_ENV=development
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Load sample data**
   ```bash
   npm run prisma:seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

   The API will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

## 💡 How It Works

### 1. Routes Tab

**What it does**: Displays all shipping routes with their fuel consumption and emissions data.

**Key features**:
- Filter routes by vessel type, fuel type, and year
- View GHG intensity (greenhouse gas emissions per energy unit)
- Set a baseline route for comparison purposes

**Why it matters**: This is your data foundation. All compliance calculations start here.

### 2. Compare Tab

**What it does**: Compares all routes against the baseline and regulatory targets.

**Key features**:
- Shows percentage difference from baseline
- Indicates compliance status (compliant/non-compliant)
- Visual charts showing performance trends
- Target values based on the year (targets get stricter over time)

**Why it matters**: Helps identify which routes meet EU requirements and which need improvement.

### 3. Banking Tab

**What it does**: Manages surplus compliance balance that can be saved for future years.

**How it works**:
- If a ship performs better than required, it generates surplus
- This surplus can be "banked" (saved)
- Banked surplus can be applied to future years when there's a deficit

**Key features**:
- Bank positive compliance balance
- Apply banked balance to offset deficits
- View all banking transactions

**Why it matters**: Provides flexibility - good years can help cover challenging years.

### 4. Pooling Tab

**What it does**: Allows multiple ships to share their compliance balance.

**How it works**:
- Ships with surplus can help ships with deficits
- The total compliance balance must remain positive
- No ship can end up worse off than it started

**Key features**:
- Create pools with multiple ships
- Validate pooling rules automatically
- View all existing pools

**Why it matters**: Companies with multiple ships can optimize compliance across their fleet.

## 📊 Key Concepts

### GHG Intensity Target
The EU sets decreasing limits on emissions over time:
- 2025-2029: 89.34 gCO₂eq/MJ (2% reduction)
- 2030-2034: 85.69 gCO₂eq/MJ (6% reduction)
- And progressively stricter until 2050

### Compliance Balance
The difference between your target and actual emissions:
- **Positive balance** = Surplus (performing better than required)
- **Negative balance** = Deficit (penalty required)
- **Zero balance** = Exactly meeting requirements

### Banking Rules
- Only positive balances can be banked
- Banked balance accumulates over years
- No expiration on banked surplus

### Pooling Rules
- Pool must have at least 2 members
- Total balance before pooling must be non-negative
- Total balance is conserved (before = after)
- Deficit ships cannot get worse
- Surplus ships cannot become deficit

## 🔧 API Endpoints

The backend provides these main endpoints:

**Routes**
- `GET /api/routes` - List all routes
- `POST /api/routes/:routeId/baseline` - Set baseline
- `GET /api/routes/comparison` - Get comparison data

**Compliance**
- `POST /api/compliance/cb` - Calculate compliance balance
- `GET /api/compliance/adjusted-cb` - Get adjusted balance

**Banking**
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked surplus
- `GET /api/banking/records` - View records

**Pooling**
- `POST /api/pools` - Create pool
- `GET /api/pools?year=2025` - List pools by year

## 🧪 Testing

**Backend tests**
```bash
cd backend
npm test
```

**Frontend tests**
```bash
cd frontend
npm test
```

## 📝 Database Schema

The database stores:
- **Routes**: Voyage data with emissions and fuel consumption
- **Ship Compliance**: Calculated compliance balances
- **Bank Entries**: Banking transactions
- **Pools**: Pooling arrangements with member ships

## 🐛 Troubleshooting

**Backend won't start**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Run `npx prisma migrate dev` again

**Frontend can't connect to backend**
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify proxy settings in `vite.config.ts`

**Database errors**
- Reset database: `npx prisma migrate reset`
- Regenerate client: `npx prisma generate`

## 📈 Production Deployment

**Backend**
```bash
npm run build
npm start
```

**Frontend**
```bash
npm run build
npm run preview
```

The build output will be in the `dist` folder.

## 🤝 Contributing

This project was built following FuelEU Maritime Regulation (EU) 2023/1805 requirements. All calculations and formulas are based on official EU documentation.
