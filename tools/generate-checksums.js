#!/usr/bin/env node

// Script to generate checksums for release binaries
// This should be run during the release process

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const BINARY_NAMES = [
  'node-raylib-linux-x64.node',
  'node-raylib-linux-arm.node',
  'node-raylib-linux-arm64.node',
  'node-raylib-linux-arm-drm.node',
  'node-raylib-linux-arm64-drm.node',
  'node-raylib-win32-x64.node',
  'node-raylib-darwin-x64.node',
  'node-raylib-darwin-arm64.node'
]

function generateChecksum (filePath) {
  const fileBuffer = fs.readFileSync(filePath)
  const hashSum = crypto.createHash('sha256')
  hashSum.update(fileBuffer)
  return hashSum.digest('hex')
}

function main () {
  const buildDir = path.join(__dirname, '..', 'build', 'Release')
  const checksums = {}

  console.log('Generating checksums for release binaries...')

  for (const binaryName of BINARY_NAMES) {
    const binaryPath = path.join(buildDir, binaryName)

    if (fs.existsSync(binaryPath)) {
      const checksum = generateChecksum(binaryPath)
      checksums[binaryName] = checksum
      console.log(`✓ ${binaryName}: ${checksum}`)
    } else {
      console.log(`⚠ ${binaryName}: not found`)
    }
  }

  // Write checksums to file
  const checksumsPath = path.join(__dirname, '..', 'checksums.json')
  fs.writeFileSync(checksumsPath, JSON.stringify(checksums, null, 2))

  console.log(`\nChecksums written to: ${checksumsPath}`)
}

if (require.main === module) {
  main()
}

module.exports = { generateChecksum }
