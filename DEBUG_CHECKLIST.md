# Debugging ERR_CONNECTION_REFUSED

Run these commands on YOUR local machine (not in this cloud environment) and share the output:

## Step 1: Check Node.js
```bash
node --version
npm --version
```
**Expected:** Node v18+ and npm 8+

## Step 2: Clone and navigate
```bash
git clone <your-repo-url>
cd Comic-Book-Tracker
ls -la
```
**Expected:** Should see backend/, frontend/, README.md, etc.

## Step 3: Install backend dependencies
```bash
cd backend
npm install
```
**Look for:** Any errors during installation?

## Step 4: Create backend .env file
```bash
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
JWT_SECRET=comic-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EOF

cat .env
```
**Expected:** File should contain exactly those 5 lines

## Step 5: Seed the database
```bash
node seed.js
```
**Expected output:**
```
Connected to NeDB
Database cleared
Demo user created: demo@example.com
10 sample comics added
Seed completed successfully!
Total value: $3,991,925.00
```

## Step 6: Start backend (keep terminal open)
```bash
node server.js
```
**Expected output:**
```
Server running on port 5000
Environment: development
```
**If you see an error instead, copy it exactly**

## Step 7: Test backend (NEW terminal, leave first one running)
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"ok","timestamp":"...","uptime":...}`

## Step 8: Install frontend dependencies
```bash
cd ../frontend
npm install
```
**Look for:** Any errors?

## Step 9: Create frontend .env
```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CHAIN_ID=1337
EOF

cat .env
```

## Step 10: Start frontend (keep both terminals open)
```bash
npm run dev
```
**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 11: Check what's running
```bash
# In a THIRD terminal
netstat -an | grep LISTEN | grep -E '5000|5173'
# OR on Mac/some Linux:
lsof -i :5000
lsof -i :5173
```
**Expected:** Should show processes listening on ports 5000 and 5173

## Step 12: Access in browser
Open: `http://localhost:5173`

---

## Common Errors:

### "EADDRINUSE: port already in use"
```bash
# Kill existing process
lsof -i :5000
kill -9 <PID>
# OR
npx kill-port 5000
```

### "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### "ECONNREFUSED" when frontend tries to reach backend
- Make sure backend is still running (check terminal 1)
- Check `frontend/.env` has correct `VITE_API_URL=http://localhost:5000/api`
- After changing .env, restart `npm run dev`

---

**Please run through these steps and tell me:**
1. Which step fails?
2. What exact error message you see?
