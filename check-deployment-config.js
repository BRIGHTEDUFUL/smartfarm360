#!/usr/bin/env node

/**
 * Pre-deployment Configuration Checker
 * Verifies all settings are correct before deploying to GitHub Pages
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: GitHub Actions workflow exists
console.log('1️⃣ Checking GitHub Actions workflow...');
const workflowPath = '.github/workflows/deploy-gh-pages.yml';
if (fs.existsSync(workflowPath)) {
  console.log('   ✅ GitHub Actions workflow found');
} else {
  console.log('   ❌ GitHub Actions workflow missing');
  hasErrors = true;
}

// Check 2: Production environment file
console.log('\n2️⃣ Checking production environment file...');
const envProdPath = 'frontend/.env.production';
if (fs.existsSync(envProdPath)) {
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  console.log('   ✅ .env.production found');
  
  // Check if API URL is configured
  if (envContent.includes('your-backend-url.onrender.com')) {
    console.log('   ⚠️  WARNING: Update VITE_API_URL with your actual backend URL');
    hasWarnings = true;
  } else if (envContent.includes('VITE_API_URL=')) {
    console.log('   ✅ VITE_API_URL configured');
  } else {
    console.log('   ❌ VITE_API_URL not found in .env.production');
    hasErrors = true;
  }
} else {
  console.log('   ❌ .env.production missing');
  hasErrors = true;
}

// Check 3: Vite config
console.log('\n3️⃣ Checking Vite configuration...');
const viteConfigPath = 'frontend/vite.config.ts';
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  console.log('   ✅ vite.config.ts found');
  
  if (viteConfig.includes('base:')) {
    console.log('   ✅ Base path configured');
  } else {
    console.log('   ⚠️  WARNING: Base path not configured (may cause issues on GitHub Pages)');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ vite.config.ts missing');
  hasErrors = true;
}

// Check 4: API service configuration
console.log('\n4️⃣ Checking API service...');
const apiPath = 'frontend/src/services/api.ts';
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  console.log('   ✅ api.ts found');
  
  if (apiContent.includes('VITE_API_URL')) {
    console.log('   ✅ Environment variable support configured');
  } else {
    console.log('   ⚠️  WARNING: API may not use environment variables');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ api.ts missing');
  hasErrors = true;
}

// Check 5: Package.json scripts
console.log('\n5️⃣ Checking build scripts...');
const packagePath = 'frontend/package.json';
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('   ✅ package.json found');
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('   ✅ Build script configured');
  } else {
    console.log('   ❌ Build script missing');
    hasErrors = true;
  }
} else {
  console.log('   ❌ package.json missing');
  hasErrors = true;
}

// Check 6: Git repository
console.log('\n6️⃣ Checking Git repository...');
if (fs.existsSync('.git')) {
  console.log('   ✅ Git repository initialized');
} else {
  console.log('   ❌ Not a Git repository');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Configuration check FAILED');
  console.log('\nPlease fix the errors above before deploying.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration check passed with WARNINGS');
  console.log('\nYou can deploy, but review the warnings above.');
  console.log('\n📚 Next steps:');
  console.log('   1. Update frontend/.env.production with your backend URL');
  console.log('   2. Add VITE_API_URL secret in GitHub repository settings');
  console.log('   3. Push to main branch to trigger deployment');
  console.log('\n📖 See DEPLOYMENT_QUICK_START.md for detailed instructions');
} else {
  console.log('✅ Configuration check PASSED');
  console.log('\n🚀 Ready to deploy!');
  console.log('\n📚 Next steps:');
  console.log('   1. Deploy backend to Render.com');
  console.log('   2. Update VITE_API_URL in GitHub secrets');
  console.log('   3. Push to main branch');
  console.log('\n📖 See DEPLOYMENT_QUICK_START.md for detailed instructions');
}
console.log('='.repeat(60) + '\n');
