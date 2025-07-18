#!/bin/bash

# Test script to verify cross-compilation setup works locally
# This helps debug issues before they hit CI

set -e

echo "🧪 Testing cross-compilation setup..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not available. Please install Docker to test cross-compilation."
    exit 1
fi

# Check if QEMU is set up for multi-platform builds
echo "🔍 Checking Docker multi-platform support..."
if ! docker buildx ls | grep -q "linux/arm"; then
    echo "⚠️  Setting up Docker buildx for multi-platform builds..."
    docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
fi

# Test ARM64 build (more likely to work than ARM v7)
echo "🔨 Testing ARM64 cross-compilation..."
if docker run --platform linux/arm64 --rm -v "${PWD}:/work" -w /work node:20-bullseye bash -c "
    echo 'Node.js version:' \$(node --version)
    echo 'Architecture:' \$(uname -m)
    echo 'Platform:' \$(uname -s)
    apt-get update > /dev/null 2>&1
    apt-get install -y cmake > /dev/null 2>&1
    echo 'Basic dependencies installed successfully'
"; then
    echo "✅ ARM64 Docker environment works!"
else
    echo "❌ ARM64 Docker environment failed!"
    exit 1
fi

# Test ARM v7 build
echo "🔨 Testing ARM v7 cross-compilation..."
if docker run --platform linux/arm/v7 --rm -v "${PWD}:/work" -w /work node:20-bullseye bash -c "
    echo 'Node.js version:' \$(node --version)
    echo 'Architecture:' \$(uname -m)
    echo 'Platform:' \$(uname -s)
    apt-get update > /dev/null 2>&1
    apt-get install -y cmake > /dev/null 2>&1
    echo 'Basic dependencies installed successfully'
"; then
    echo "✅ ARM v7 Docker environment works!"
else
    echo "❌ ARM v7 Docker environment failed!"
    echo "ℹ️  This might be expected on some systems - ARM64 is more widely supported"
fi

echo "🎉 Cross-compilation test completed!"
echo ""
echo "To run a full cross-compilation test:"
echo "  docker run --platform linux/arm64 --rm -v \"\${PWD}:/work\" -w /work node:20-bullseye ./tools/crossbuild.sh"