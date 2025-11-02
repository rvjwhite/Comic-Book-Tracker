#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Configuration Checker\n');

const checks = {
  backend: {
    path: 'backend/.env',
    required: ['MONGODB_URI', 'JWT_SECRET', 'PORT'],
    optional: ['NODE_ENV', 'JWT_EXPIRE']
  },
  frontend: {
    path: 'frontend/.env',
    required: ['VITE_API_URL'],
    optional: ['VITE_CONTRACT_ADDRESS', 'VITE_CHAIN_ID']
  },
  contracts: {
    path: 'contracts/.env',
    required: [],
    optional: ['SEPOLIA_RPC_URL', 'PRIVATE_KEY', 'ETHERSCAN_API_KEY']
  }
};

let allValid = true;

Object.entries(checks).forEach(([component, config]) => {
  console.log(`\n📋 Checking ${component}...`);

  const envPath = path.join(process.cwd(), config.path);

  if (!fs.existsSync(envPath)) {
    console.log(`  ❌ ${config.path} not found`);
    console.log(`     Run: cp ${config.path}.example ${config.path}`);
    allValid = false;
    return;
  }

  console.log(`  ✅ ${config.path} exists`);

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  });

  // Check required variables
  config.required.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== 'your-' && !envVars[varName].includes('example')) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.log(`  ❌ ${varName} is missing or not configured`);
      allValid = false;
    }
  });

  // Check optional variables
  config.optional.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== 'your-' && !envVars[varName].includes('example')) {
      console.log(`  ✅ ${varName} is set (optional)`);
    } else {
      console.log(`  ⚠️  ${varName} is not set (optional)`);
    }
  });
});

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('✅ All required environment variables are configured!');
  console.log('\nYou can now start the application with:');
  console.log('  npm run dev\n');
  process.exit(0);
} else {
  console.log('❌ Some environment variables need attention.');
  console.log('\nPlease configure the missing variables before starting the app.');
  console.log('See SETUP_GUIDE.md for details.\n');
  process.exit(1);
}
