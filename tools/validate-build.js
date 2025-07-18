#!/usr/bin/env node

// Build validation script to ensure the compiled binary works correctly

const path = require('node:path')
const fs = require('node:fs')

console.log('🔍 Validating node-raylib build...')

// Check if build directory exists
const buildPath = path.join(__dirname, '..', 'build', 'Release', 'node-raylib.node')
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build file not found:', buildPath)
  process.exit(1)
}

console.log('✓ Build file exists')

// Try to load the module
try {
  const raylib = require('../index.js')
  console.log('✓ Module loads successfully')

  // Test basic functionality
  if (typeof raylib.InitWindow !== 'function') {
    throw new Error('InitWindow function not found')
  }
  console.log('✓ Core functions available')

  // Test constants
  if (typeof raylib.RAYWHITE === 'undefined') {
    throw new Error('Constants not loaded')
  }
  console.log('✓ Constants loaded')

  // Test enums
  if (typeof raylib.KEY_A !== 'number') {
    throw new Error('Enums not loaded')
  }
  console.log('✓ Enums loaded')

  console.log('🎉 Build validation successful!')
} catch (error) {
  console.error('❌ Build validation failed:', error.message)
  process.exit(1)
}
