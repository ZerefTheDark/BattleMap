#!/bin/bash

# Playwright MCP Server Installation and Setup Script for BattleMap
# This script automates the installation and configuration of Playwright and MCP server

set -e  # Exit on any error

echo "🚀 Setting up Playwright MCP Server for BattleMap..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    print_status "Node.js is installed ($(node --version))"
else
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if command -v python3 >/dev/null 2>&1; then
    print_status "Python 3 is installed ($(python3 --version))"
else
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_status "Node.js dependencies installed"
else
    print_warning "package.json not found, skipping npm install"
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
if command -v npx >/dev/null 2>&1; then
    npx playwright install
    print_status "Playwright browsers installed"
    
    # Install system dependencies for Playwright
    echo "🔧 Installing system dependencies..."
    npx playwright install-deps 2>/dev/null || {
        print_warning "Could not install system dependencies automatically."
        print_warning "You may need to run: sudo npx playwright install-deps"
    }
else
    print_warning "npx not available, skipping Playwright browser installation"
fi

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
if [ -f "backend/requirements.txt" ]; then
    pip3 install -r backend/requirements.txt
    print_status "Python dependencies installed"
    
    # Install Playwright for Python
    python3 -m playwright install 2>/dev/null || {
        print_warning "Could not install Playwright browsers for Python"
    }
else
    print_warning "backend/requirements.txt not found, skipping Python dependencies"
fi

# Create test files if they don't exist
echo "📋 Setting up test files..."
mkdir -p tests

# Basic Playwright test
cat > tests/battlemap.spec.js << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('BattleMap Application', () => {
  test('loads the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dragon Stones/);
    await expect(page.locator('h1')).toContainText('The Dragon Stones');
  });

  test('has working navigation tools', async ({ page }) => {
    await page.goto('/');
    
    // Check that tool buttons are present
    await expect(page.locator('[data-tool="move"]')).toBeVisible();
    await expect(page.locator('[data-tool="ruler"]')).toBeVisible();
    await expect(page.locator('[data-tool="fog"]')).toBeVisible();
    await expect(page.locator('[data-tool="token"]')).toBeVisible();
  });

  test('party manager panel works', async ({ page }) => {
    await page.goto('/');
    
    // Click on Party tab
    await page.click('[data-panel="party"]');
    await expect(page.locator('#panel-content')).toContainText('Party Manager');
  });

  test('dice roller functions', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dice panel
    await page.click('[data-panel="dice"]');
    await expect(page.locator('#panel-content')).toContainText('Dice Roller');
    
    // Test dice button
    await page.click('[data-dice="1d20"]');
    // Should see a result in recent rolls or chat
  });
});
EOF

print_status "Test files created"

# Test the installation
echo "🧪 Testing installation..."

# Test MCP server syntax
if [ -f "mcp-server.js" ]; then
    node -c mcp-server.js && print_status "MCP server syntax OK" || print_error "MCP server has syntax errors"
else
    print_warning "MCP server file not found"
fi

# Test Playwright config
if [ -f "playwright.config.js" ]; then
    node -c playwright.config.js && print_status "Playwright config syntax OK" || print_error "Playwright config has syntax errors"
else
    print_warning "Playwright config file not found"
fi

# Test if Playwright can run
echo "🔍 Testing Playwright installation..."
if command -v npx >/dev/null 2>&1; then
    npx playwright --version && print_status "Playwright CLI working" || print_warning "Playwright CLI not working"
else
    print_warning "npx not available for Playwright testing"
fi

# Create startup scripts
echo "📝 Creating startup scripts..."

# MCP server startup script
cat > start-mcp-server.sh << 'EOF'
#!/bin/bash
echo "Starting BattleMap MCP Server..."
node mcp-server.js
EOF
chmod +x start-mcp-server.sh

# Development server startup script  
cat > start-dev-server.sh << 'EOF'
#!/bin/bash
echo "Starting BattleMap development server on http://localhost:8000"
python3 -m http.server 8000
EOF
chmod +x start-dev-server.sh

# Health check script
cat > health-check.js << 'EOF'
const { chromium } = require('playwright');

async function healthCheck() {
  console.log('🔍 Running BattleMap health check...');
  
  try {
    // Test browser launch
    const browser = await chromium.launch({ headless: true });
    console.log('✅ Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('✅ Page created successfully');
    
    // Test local server
    try {
      await page.goto('http://localhost:8000', { timeout: 5000 });
      console.log('✅ Application loaded successfully');
      
      // Test basic functionality
      const title = await page.title();
      if (title.includes('Dragon Stones')) {
        console.log('✅ Application title correct');
      } else {
        console.log('⚠️  Unexpected title:', title);
      }
    } catch (error) {
      console.log('⚠️  Could not connect to localhost:8000');
      console.log('   Make sure to start the dev server first: ./start-dev-server.sh');
    }
    
    await browser.close();
    console.log('✅ Health check completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Run: npx playwright install');
    console.log('2. Run: npx playwright install-deps');
    console.log('3. Check the PLAYWRIGHT_TROUBLESHOOTING.md file');
    return false;
  }
}

if (require.main === module) {
  healthCheck().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { healthCheck };
EOF

print_status "Startup scripts created"

echo ""
print_status "🎉 Playwright MCP Server setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Start the development server: ./start-dev-server.sh"
echo "  2. In another terminal, start MCP server: ./start-mcp-server.sh"
echo "  3. Run health check: node health-check.js"
echo "  4. Run tests: npm test"
echo ""
echo "📖 Documentation:"
echo "  - Troubleshooting: PLAYWRIGHT_TROUBLESHOOTING.md"
echo "  - Developer Guide: DEVELOPER_GUIDE.md"
echo ""
echo "🐛 If you encounter issues:"
echo "  - Check the troubleshooting guide"
echo "  - Run the health check script"
echo "  - Submit logs to the repository issues"