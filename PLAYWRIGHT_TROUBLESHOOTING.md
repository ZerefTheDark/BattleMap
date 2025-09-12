# Playwright MCP Server Troubleshooting Guide

## Overview

This guide helps troubleshoot issues with the Playwright MCP (Model Context Protocol) server for the BattleMap application. The MCP server provides programmatic access to battle map functionality.

## Common Issues and Solutions

### 1. Playwright Not Installed

**Symptoms:**
- `playwright: command not found`
- `ModuleNotFoundError: No module named 'playwright'`
- MCP server fails to start with missing dependencies

**Solutions:**

#### For Node.js/JavaScript Environment:
```bash
# Install Playwright and dependencies
npm install
npm run install:playwright
npm run install:deps

# Or manually:
npm install @playwright/test
npx playwright install
npx playwright install-deps
```

#### For Python Environment:
```bash
# Add to requirements.txt
echo "playwright>=1.40.0" >> backend/requirements.txt

# Install playwright
pip install playwright
playwright install
playwright install-deps
```

### 2. Browser Dependencies Missing

**Symptoms:**
- Browser fails to launch
- "Executable doesn't exist" errors
- Timeout during browser startup

**Solutions:**

```bash
# Install browser dependencies (Linux/Ubuntu)
sudo apt-get update
sudo apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2

# Install Playwright browsers
npx playwright install chromium firefox webkit

# For system-wide installation
npx playwright install-deps
```

### 3. MCP Server Configuration Issues

**Symptoms:**
- MCP server won't start
- Connection timeouts
- Protocol errors

**Solutions:**

#### Check MCP Server Configuration:
```bash
# Verify MCP server file exists
ls -la mcp-server.js

# Test MCP server startup
node mcp-server.js

# Check for syntax errors
node -c mcp-server.js
```

#### Verify Package Dependencies:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### 4. Environment Setup Issues

**Symptoms:**
- Permission denied errors
- Port already in use
- File system access issues

**Solutions:**

#### Fix Permissions:
```bash
# Make scripts executable
chmod +x mcp-server.js

# Fix file permissions
chmod 644 playwright.config.js
chmod 644 package.json
```

#### Check Port Availability:
```bash
# Check if port 8000 is in use
netstat -tlnp | grep :8000
lsof -i :8000

# Kill process using port
sudo kill -9 $(lsof -t -i:8000)
```

### 5. Playwright Configuration Issues

**Symptoms:**
- Tests fail to run
- Configuration not found
- Browser launch failures

**Solutions:**

#### Verify Playwright Config:
```javascript
// playwright.config.js
export default defineConfig({
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

#### Test Configuration:
```bash
# Validate config
npx playwright test --list

# Run with debug
npx playwright test --debug

# Check browser installation
npx playwright install --dry-run
```

## Diagnostic Commands

### System Information
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check Python version
python3 --version

# Check Playwright installation
npx playwright --version
```

### Debug MCP Server
```bash
# Start MCP server with debug output
DEBUG=* node mcp-server.js

# Test MCP server connectivity
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node mcp-server.js
```

### Test Battle Map Application
```bash
# Start HTTP server
python3 -m http.server 8000

# Test in browser
curl http://localhost:8000

# Run Playwright tests
npm test
```

## Environment Variables

Set these environment variables for better debugging:

```bash
# Enable debug output
export DEBUG=playwright:*
export DEBUG_COLORS=1

# MCP server settings
export MCP_SERVER_PORT=3000
export MCP_LOG_LEVEL=debug

# Playwright settings
export PLAYWRIGHT_BROWSERS_PATH=/opt/playwright
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

## Installation Script

Create an automated installation script:

```bash
#!/bin/bash
# install-playwright-mcp.sh

echo "Installing Playwright MCP Server for BattleMap..."

# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install system dependencies
npx playwright install-deps

# Test installation
echo "Testing installation..."
npx playwright --version
node -c mcp-server.js

echo "Installation complete!"
echo "Start MCP server with: npm run mcp:start"
echo "Run tests with: npm test"
```

## Docker Setup (Alternative)

For consistent environment setup:

```dockerfile
# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8000 3000

CMD ["npm", "run", "mcp:start"]
```

## Performance Optimization

### Browser Settings
```javascript
// playwright.config.js optimizations
use: {
  // Reduce resource usage
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  
  // Faster execution
  actionTimeout: 10000,
  navigationTimeout: 30000,
}
```

### MCP Server Optimization
```javascript
// mcp-server.js optimizations
process.env.NODE_OPTIONS = '--max-old-space-size=2048';

// Connection pooling
const maxConnections = 10;
const connectionTimeout = 30000;
```

## Getting Help

### Log Collection
```bash
# Collect debug logs
npm test 2>&1 | tee playwright-debug.log
node mcp-server.js 2>&1 | tee mcp-debug.log

# System information
uname -a > system-info.txt
npm list --depth=0 >> system-info.txt
```

### Common Log Patterns

- `Error: Browser closed` → Browser crashed, check system resources
- `TimeoutError` → Network issues or slow responses
- `Protocol error` → MCP communication issues
- `ECONNREFUSED` → Server not running or wrong port

### Support Resources

1. **Playwright Documentation**: https://playwright.dev/docs/
2. **MCP Specification**: https://modelcontextprotocol.io/
3. **GitHub Issues**: Submit logs and system info
4. **Community Forums**: Stack Overflow with tags: `playwright`, `mcp`

## Automated Health Check

```javascript
// health-check.js
const { chromium } = require('playwright');

async function healthCheck() {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await browser.close();
    console.log('✅ Playwright health check passed');
    return true;
  } catch (error) {
    console.error('❌ Playwright health check failed:', error.message);
    return false;
  }
}

healthCheck();
```

Run health check:
```bash
node health-check.js
```

This troubleshooting guide should resolve most common Playwright MCP server issues. Always check the logs first and ensure all dependencies are properly installed.