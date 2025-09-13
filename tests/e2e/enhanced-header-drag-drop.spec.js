const { test, expect } = require('@playwright/test');

test.describe('Enhanced Header Drag-and-Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should handle complete drag-drop lifecycle with proper events', async ({ page }) => {
    // Open control center and module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    // Wait for module to appear
    await page.waitForSelector('#module-party .module-header');
    
    // Get elements for manual drag simulation
    const moduleHeader = page.locator('#module-party .module-header');
    const mainHeader = page.locator('#main-header');
    
    // Get initial positions
    const moduleBox = await moduleHeader.boundingBox();
    const headerBox = await mainHeader.boundingBox();
    
    expect(moduleBox).toBeTruthy();
    expect(headerBox).toBeTruthy();
    
    // Simulate manual drag with proper event sequence
    // 1. Mouse down on module header
    await moduleHeader.hover();
    await page.mouse.down();
    
    // 2. Move mouse over header while dragging
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    
    // 3. Mouse up over header to complete drop
    await page.mouse.up();
    
    // Verify module was repositioned
    const finalBox = await page.locator('#module-party').boundingBox();
    expect(finalBox.y).toBeLessThan(200); // Should be near top
    expect(finalBox.y).toBeGreaterThan(headerBox.bottom); // Should be below header
  });

  test('should provide visual feedback during drag operations', async ({ page }) => {
    // Open module
    await page.click('#control-center-toggle');
    await page.click('[data-module="chat"]');
    
    await page.waitForSelector('#module-chat .module-header');
    
    const moduleHeader = page.locator('#module-chat .module-header');
    const mainHeader = page.locator('#main-header');
    
    // Start drag
    await moduleHeader.hover();
    await page.mouse.down();
    
    // Move over header
    const headerBox = await mainHeader.boundingBox();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    
    // Check for visual feedback
    await expect(mainHeader).toHaveClass(/drag-over/);
    
    // Move away from header
    await page.mouse.move(100, 100);
    
    // Visual feedback should be removed
    await expect(mainHeader).not.toHaveClass(/drag-over/);
    
    // Complete drag
    await page.mouse.up();
  });

  test('should maintain module functionality after docking', async ({ page }) => {
    // Open and dock module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    await page.waitForSelector('#module-party .module-header');
    
    // Perform drag-drop to header
    const moduleHeader = page.locator('#module-party .module-header');
    const mainHeader = page.locator('#main-header');
    
    await moduleHeader.hover();
    await page.mouse.down();
    
    const headerBox = await mainHeader.boundingBox();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Test module controls still work
    const collapseBtn = page.locator('#module-party .collapse-btn');
    await collapseBtn.click();
    
    // Module should collapse
    await expect(page.locator('#module-party')).toHaveClass(/collapsed/);
    
    // Expand again
    await collapseBtn.click();
    await expect(page.locator('#module-party')).not.toHaveClass(/collapsed/);
    
    // Test close functionality
    const closeBtn = page.locator('#module-party .close-btn');
    await closeBtn.click();
    
    // Module should be hidden
    await expect(page.locator('#module-party')).toHaveClass(/hidden/);
  });

  test('should handle multiple modules being docked', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    
    // Dock party module
    await page.click('[data-module="party"]');
    await page.waitForSelector('#module-party .module-header');
    
    let moduleHeader = page.locator('#module-party .module-header');
    let headerBox = await page.locator('#main-header').boundingBox();
    
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Dock chat module
    await page.click('[data-module="chat"]');
    await page.waitForSelector('#module-chat .module-header');
    
    moduleHeader = page.locator('#module-chat .module-header');
    
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Both modules should be visible and positioned near header
    await expect(page.locator('#module-party')).toBeVisible();
    await expect(page.locator('#module-chat')).toBeVisible();
    
    const partyBox = await page.locator('#module-party').boundingBox();
    const chatBox = await page.locator('#module-chat').boundingBox();
    
    expect(partyBox.y).toBeLessThan(200);
    expect(chatBox.y).toBeLessThan(200);
  });

  test('should not interfere with header functionality', async ({ page }) => {
    // Test header tools still work after drag-drop operations
    await page.click('#control-center-toggle');
    await page.click('[data-module="tools"]');
    
    await page.waitForSelector('#module-tools .module-header');
    
    // Dock tools module
    const moduleHeader = page.locator('#module-tools .module-header');
    const headerBox = await page.locator('#main-header').boundingBox();
    
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Verify header buttons still work
    await page.click('#tool-ruler');
    await expect(page.locator('#tool-ruler')).toHaveClass(/active/);
    
    await page.click('#tool-move');
    await expect(page.locator('#tool-move')).toHaveClass(/active/);
    
    await page.click('#grid-toggle');
    // Grid should toggle (specific test would depend on implementation)
  });

  test('should log debug information correctly', async ({ page }) => {
    // Monitor console for debug logs
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('DRAG-DROP')) {
        logs.push(msg.text());
      }
    });
    
    // Open module and perform drag
    await page.click('#control-center-toggle');
    await page.click('[data-module="dice"]');
    
    await page.waitForSelector('#module-dice .module-header');
    
    const moduleHeader = page.locator('#module-dice .module-header');
    const headerBox = await page.locator('#main-header').boundingBox();
    
    // Clear existing logs
    logs.length = 0;
    
    // Perform drag operation
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Wait a bit for async logs
    await page.waitForTimeout(200);
    
    // Verify debug logs were generated
    expect(logs.length).toBeGreaterThan(0);
    
    // Check for key log events
    const logText = logs.join(' ');
    expect(logText).toContain('MODULE_MOUSEDOWN');
    expect(logText).toContain('HEADER_MOUSEENTER');
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    // Test dragging without a valid target
    await page.click('#control-center-toggle');
    await page.click('[data-module="maps"]');
    
    await page.waitForSelector('#module-maps .module-header');
    
    const moduleHeader = page.locator('#module-maps .module-header');
    
    // Drag to random location (not header)
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(500, 500);
    await page.mouse.up();
    
    // Module should remain in original position or move normally
    // (Not dock to header)
    const moduleBox = await page.locator('#module-maps').boundingBox();
    expect(moduleBox).toBeTruthy();
    
    // Test rapid drag operations
    const headerBox = await page.locator('#main-header').boundingBox();
    
    // Rapid drag sequence
    await moduleHeader.hover();
    await page.mouse.down();
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await page.mouse.up();
    
    // Should handle without errors
    const finalBox = await page.locator('#module-maps').boundingBox();
    expect(finalBox.y).toBeLessThan(200);
  });
});