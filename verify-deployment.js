#!/usr/bin/env node

/**
 * Smart Farming 360 - Deployment Verification Script
 * Tests all critical endpoints after deployment
 */

const https = require('https');
const http = require('http');

// Get URL from command line or use default
const BASE_URL = process.argv[2] || 'http://localhost:5000';

console.log('🔍 Verifying deployment at:', BASE_URL);
console.log('');

const tests = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    name: 'Products List',
    path: '/api/products',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    name: 'Login Endpoint',
    path: '/api/auth/login',
    method: 'POST',
    body: { email: 'test@test.com', password: 'wrong' },
    expectedStatus: 401, // Should fail with wrong credentials
  },
  {
    name: 'Frontend (Homepage)',
    path: '/',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    name: 'Service Worker',
    path: '/service-worker.js',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    name: 'PWA Manifest',
    path: '/manifest.json',
    method: 'GET',
    expectedStatus: 200,
  },
];

function makeRequest(test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, BASE_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const passed = res.statusCode === test.expectedStatus;
        resolve({
          ...test,
          status: res.statusCode,
          passed,
          response: data.substring(0, 100),
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        ...test,
        status: 0,
        passed: false,
        error: error.message,
      });
    });

    if (test.body) {
      req.write(JSON.stringify(test.body));
    }

    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await makeRequest(test);
    
    if (result.passed) {
      console.log(`✅ ${result.name}`);
      console.log(`   Status: ${result.status}`);
      passed++;
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Expected: ${result.expectedStatus}, Got: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      failed++;
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('═══════════════════════════════════════');

  if (failed === 0) {
    console.log('');
    console.log('🎉 All tests passed! Deployment is successful!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test user registration');
    console.log('2. Test product browsing');
    console.log('3. Test order placement');
    console.log('4. Test PWA installation');
    process.exit(0);
  } else {
    console.log('');
    console.log('⚠️  Some tests failed. Please check the logs.');
    process.exit(1);
  }
}

console.log('Running deployment verification tests...');
console.log('');

runTests().catch((error) => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
