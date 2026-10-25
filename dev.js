const { spawn, exec } = require('child_process');
const path = require('path');

console.log('============================================================');
console.log('         🌾 HIRA AGRO INDUSTRY - LOCALHOST RUNNER           ');
console.log('============================================================\n');

const projectRoot = __dirname;
const serverDir = path.join(projectRoot, 'server');
const clientDir = path.join(projectRoot, 'client');

// 1. Start Backend (Express on Port 5000)
console.log('📦 [1/2] Starting Backend Server (Express + MongoDB)...');
const backend = spawn('node', ['server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err.message);
});

// 2. Start Frontend (Vite on Port 5173)
console.log('🎨 [2/2] Starting Frontend Server (Vite + React)...');
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const frontend = spawn(npxCmd, ['vite', '--host', '--port', '5173'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('❌ Frontend failed to start:', err.message);
});

// 3. Open browser after 3 seconds
setTimeout(() => {
  console.log('\n🌐 Opening browser at http://localhost:5173 ...\n');
  if (isWin) {
    exec('start http://localhost:5173');
  }
}, 3000);

// Handle exit cleanly
process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
