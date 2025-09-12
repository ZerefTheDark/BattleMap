import { test, expect } from '@playwright/test';

test.describe('Modular Panel Drag Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should open control center without errors', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    
    // Verify control center is visible
    await expect(page.locator('#control-center')).toBeVisible();
    await expect(page.locator('#control-center')).toContainText('Module Control Center');
  });

  test('should open party module without JavaScript errors', async ({ page }) => {
    // Open control center first
    await page.click('#control-center-toggle');
    
    // Open party module
    await page.click('[data-module="party"]');
    
    // Verify party module opened successfully
    await expect(page.locator('#module-party')).toBeVisible();
    await expect(page.locator('#module-party')).toContainText('Party Manager');
    
    // Verify no JavaScript errors by checking console
    const messages = await page.evaluate(() => {
      return window.console._errors || [];
    });
    
    // Party module should open without errors
    expect(messages.length).toBe(0);
  });

  test('should drag party module without errors', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    // Get party module header for dragging
    const partyHeader = page.locator('#module-party .module-header');
    await expect(partyHeader).toBeVisible();
    
    // Get initial position
    const initialBox = await partyHeader.boundingBox();
    
    // Perform drag operation
    await partyHeader.dragTo(page.locator('#battle-canvas'), {
      targetPosition: { x: 200, y: 200 }
    });
    
    // Verify module moved (position should be different)
    const finalBox = await partyHeader.boundingBox();
    expect(finalBox.x).not.toBe(initialBox.x);
  });

  test('should open multiple modules and drag both without conflicts', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    
    // Open party module
    await page.click('[data-module="party"]');
    await expect(page.locator('#module-party')).toBeVisible();
    
    // Open chat module
    await page.click('[data-module="chat"]');
    await expect(page.locator('#module-chat')).toBeVisible();
    
    // Both modules should be visible
    await expect(page.locator('#module-party')).toBeVisible();
    await expect(page.locator('#module-chat')).toBeVisible();
    
    // Drag party module
    const partyHeader = page.locator('#module-party .module-header');
    await partyHeader.dragTo(page.locator('#battle-canvas'), {
      targetPosition: { x: 100, y: 150 }
    });
    
    // Drag chat module
    const chatHeader = page.locator('#module-chat .module-header');
    await chatHeader.dragTo(page.locator('#battle-canvas'), {
      targetPosition: { x: 300, y: 250 }
    });
    
    // Both modules should still be visible after dragging
    await expect(page.locator('#module-party')).toBeVisible();
    await expect(page.locator('#module-chat')).toBeVisible();
  });

  test('should collapse and expand modules without errors', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    const partyModule = page.locator('#module-party');
    const collapseBtn = partyModule.locator('.collapse-btn');
    
    // Module should be expanded initially
    await expect(partyModule).not.toHaveClass(/collapsed/);
    
    // Collapse module
    await collapseBtn.click();
    await expect(partyModule).toHaveClass(/collapsed/);
    
    // Expand module
    await collapseBtn.click();
    await expect(partyModule).not.toHaveClass(/collapsed/);
  });

  test('should verify reduced header height', async ({ page }) => {
    // Get the header element
    const header = page.locator('.bg-gray-900.border-b-2.border-green-500');
    
    // Check that header has p-1 class (reduced from p-2 by twice the previous reduction amount)
    await expect(header).toHaveClass(/p-1/);
    
    // Verify header doesn't have the old p-2 class
    await expect(header).not.toHaveClass(/p-2/);
  });

  test('should verify drag positioning accuracy', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    const partyModule = page.locator('#module-party');
    const partyHeader = page.locator('#module-party .module-header');
    await expect(partyHeader).toBeVisible();
    
    // Get initial position
    const initialBox = await partyModule.boundingBox();
    
    // Drag to a specific location
    const targetX = 300;
    const targetY = 200;
    await partyHeader.dragTo(page.locator('#battle-canvas'), {
      targetPosition: { x: targetX, y: targetY }
    });
    
    // Check final position is close to target (allowing for small offsets)
    const finalBox = await partyModule.boundingBox();
    
    // Verify the module moved to approximately the right location
    // Allow for a reasonable tolerance in positioning
    expect(Math.abs(finalBox.x - targetX)).toBeLessThan(50);
    expect(Math.abs(finalBox.y - targetY)).toBeLessThan(50);
    
    // Verify it's not jumping to incorrect locations
    expect(finalBox.x).not.toBe(initialBox.x);
    expect(finalBox.y).not.toBe(initialBox.y);
  });
});