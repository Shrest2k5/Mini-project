# Running Trash2Treasure in VS Code

This guide will help you set up and run the Trash2Treasure application directly from VS Code.

## Prerequisites

- VS Code installed
- Node.js and npm installed
- VS Code extensions (optional but recommended):
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

## Method 1: Using VS Code Terminal (Recommended)

### Step 1: Open the Project
1. Open VS Code
2. Click `File` → `Open Folder`
3. Navigate to your project folder: `C:\Users\len2k\OneDrive\Desktop\Mini`
4. Click `Select Folder`

### Step 2: Install Dependencies (First Time Only)
1. Open the integrated terminal in VS Code:
   - Press `` Ctrl + ` `` (backtick) OR
   - Click `Terminal` → `New Terminal`

2. Run the installation command:
   ```bash
   npm run install-all
   ```

### Step 3: Start the Application

**Option A: Start Both Servers Together**
- In the terminal, run:
  ```bash
  npm run dev
  ```
  This will start both backend and frontend in the same terminal.

**Option B: Start Servers Separately (Two Terminals)**

1. **Terminal 1 - Backend:**
   - Open a new terminal (Terminal → New Terminal or split terminal)
   - Run:
     ```bash
     npm run server
     ```
   - You should see: `Server running on port 5000`

2. **Terminal 2 - Frontend:**
   - Open another new terminal
   - Run:
     ```bash
     npm run client
     ```
   - Wait for compilation (may take a minute)
   - You should see: `Compiled successfully!`

### Step 4: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Method 2: Using VS Code Tasks

### Step 1: Open Command Palette
- Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac)

### Step 2: Run Tasks
1. Type `Tasks: Run Task`
2. Select one of these options:
   - **"Install All Dependencies"** - First time setup
   - **"Start Both Servers"** - Starts backend and frontend together
   - **"Start Backend Server"** - Only backend
   - **"Start Frontend"** - Only frontend

### Step 3: Access the Application
- Open your browser to http://localhost:3000

## Method 3: Using Launch Configuration (Debug Mode)

1. Go to the **Run and Debug** panel (Ctrl + Shift + D)
2. Select **"Launch Backend Server"** from the dropdown
3. Click the green play button or press F5
4. This will start the backend in debug mode

**Note:** Frontend still needs to be started manually via terminal or task.

## Quick Start Commands Summary

```bash
# Install all dependencies
npm run install-all

# Start both servers (backend + frontend)
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

## Troubleshooting

### Port Already in Use
If you get "port already in use" error:
1. Find and kill the process:
   ```powershell
   # For Windows PowerShell
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

### Dependencies Not Installed
Make sure you've run:
```bash
npm run install-all
```

### Frontend Won't Compile
1. Delete `client/node_modules` folder
2. Delete `client/package-lock.json`
3. Run:
   ```bash
   cd client
   npm install
   ```

### Backend Won't Start
1. Make sure you're in the project root directory
2. Check if `server/node_modules` exists
3. Run:
   ```bash
   cd server
   npm install
   ```

## VS Code Workspace Tips

1. **Split Terminal View:**
   - Right-click terminal tab → Split Terminal
   - Run backend in one, frontend in the other

2. **Auto-Save:**
   - Files auto-save on change (configured in settings)

3. **Format on Save:**
   - Code will auto-format when you save (if Prettier is installed)

4. **Multiple Terminal Windows:**
   - Click the `+` icon to open multiple terminals
   - Or use `Terminal → Split Terminal`

## Stopping the Servers

- In the terminal, press `Ctrl + C` to stop the running server
- If using multiple terminals, stop each one separately

## Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - React shortcuts
- **Prettier - Code formatter** - Auto-formatting
- **ESLint** - Code linting
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Bracket Pair Colorizer** - Better code readability
- **GitLens** - Git integration

Enjoy coding! 🌿
