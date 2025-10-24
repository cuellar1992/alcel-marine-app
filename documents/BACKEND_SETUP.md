# 🚀 Backend Setup Guide

## ✅ Backend Structure Created

```
server/
├── index.js                 # Main server file
├── config/
│   └── database.js         # MongoDB connection
├── models/
│   ├── Job.js              # Job model
│   └── JobType.js          # JobType model
├── controllers/
│   ├── jobController.js    # Job logic
│   └── jobTypeController.js# JobType logic
└── routes/
    ├── jobRoutes.js        # Job API routes
    └── jobTypeRoutes.js    # JobType API routes
```

---

## 📊 MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free M0 cluster)

### Step 2: Configure Database Access

1. Go to **Database Access**
2. Click **Add New Database User**
3. Create a username and password (save these!)
4. User Privileges: **Read and write to any database**

### Step 3: Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, use specific IPs

### Step 4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. It looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/alcel-marine?retryWrites=true&w=majority
   ```

---

## ⚙️ Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/alcel-marine?retryWrites=true&w=majority

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

**Important:**
- Replace `YOUR_USERNAME` with your MongoDB Atlas username
- Replace `YOUR_PASSWORD` with your MongoDB Atlas password
- Replace `YOUR_CLUSTER` with your cluster name
- The `.env` file is in `.gitignore` (won't be uploaded to git)

---

## 🚀 Start the Backend Server

### Option 1: Backend Only
```bash
npm run server
```

### Option 2: Frontend + Backend Together
```bash
npm run dev:full
```

The server will run on **http://localhost:5000**

---

## 📡 API Endpoints

### Jobs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Job Types API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-types` | Get all job types |
| POST | `/api/job-types` | Create job type |
| PUT | `/api/job-types/:id` | Update job type |
| DELETE | `/api/job-types/:id` | Delete job type |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

---

## 🧪 Test the API

### Using Browser

Visit: http://localhost:5000/api/health

### Using Postman or Thunder Client

#### Create a Job:
```
POST http://localhost:5000/api/jobs
Content-Type: application/json

{
  "jobNumber": "ALCEL-25-001",
  "vesselName": "MV Ocean Star",
  "dateTime": "2025-01-15T10:30:00",
  "port": "Sydney",
  "jobType": "ballast",
  "clientName": "Marine Corp",
  "invoiceIssue": "not-issued",
  "status": "pending",
  "remark": "Initial inspection"
}
```

#### Get All Jobs:
```
GET http://localhost:5000/api/jobs
```

---

## 📦 Database Models

### Job Model
```javascript
{
  jobNumber: String (required, unique)
  vesselName: String (required)
  dateTime: Date (required)
  port: String (required)
  jobType: String (required)
  clientName: String (required)
  invoiceIssue: String (enum: not-issued, issued, paid)
  status: String (enum: pending, in-progress, completed, cancelled)
  remark: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### JobType Model
```javascript
{
  value: String (required, unique)
  label: String (required)
  isActive: Boolean (default: true)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## 🔍 Troubleshooting

### Error: ECONNREFUSED
- Make sure MongoDB Atlas IP is whitelisted
- Check if connection string is correct

### Error: Authentication failed
- Verify username and password in `.env`
- Password must be URL encoded (special characters)

### Error: Port already in use
- Change PORT in `.env` to different number
- Or stop the process using port 5000

---

## 📝 Next Steps

1. ✅ Configure MongoDB Atlas (follow steps above)
2. ✅ Create `.env` file with your connection string
3. ✅ Run `npm run server` to start backend
4. ✅ Test API with http://localhost:5000/api/health
5. ⏭️ Connect frontend to backend (see FRONTEND_API.md)

---

**Backend is ready! Now configure your MongoDB Atlas connection.** 🎉

