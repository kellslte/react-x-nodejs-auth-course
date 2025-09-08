#!/bin/bash

# Production Deployment Script for RouterX Application
# This script builds and deploys both the API and Web applications

set -e  # Exit on any error

echo "🚀 Starting RouterX Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install yarn first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Installing dependencies..."
yarn install

print_status "Building web application..."
yarn workspace web build

if [ $? -eq 0 ]; then
    print_success "Web application built successfully"
else
    print_error "Failed to build web application"
    exit 1
fi

print_status "Building API application..."
yarn workspace api build

if [ $? -eq 0 ]; then
    print_success "API application built successfully"
else
    print_error "Failed to build API application"
    exit 1
fi

# Check if frontend build exists
if [ ! -d "web/dist" ]; then
    print_error "Frontend build not found. Please run 'yarn workspace web build' first."
    exit 1
fi

print_status "Checking production environment configuration..."
if [ ! -f "api/.env.production" ]; then
    print_warning "Production environment file not found. Creating from example..."
    if [ -f "api/production.env.example" ]; then
        cp api/production.env.example api/.env.production
        print_warning "Please update api/.env.production with your production values"
    else
        print_error "Production environment example file not found"
        exit 1
    fi
fi

print_success "Build completed successfully!"
print_status "To start the production server, run:"
echo "  NODE_ENV=production yarn workspace api start:prod"
echo ""
print_status "Or use the convenience script:"
echo "  yarn start:prod"
echo ""
print_status "The application will be available at:"
echo "  Frontend: http://localhost:31290"
echo "  API: http://localhost:31290/api/v1"
echo "  Health Check: http://localhost:31290/api/v1/health"
