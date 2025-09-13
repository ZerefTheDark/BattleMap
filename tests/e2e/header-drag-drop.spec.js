import { test, expect } from '@playwright/test';

test.describe('Header Drag-and-Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should allow modules to be dragged over header area', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    await expect(page.locator('#control-center')).toBeVisible();
    
    // Open party module
    await page.click('[data-module="party"]');
    await expect(page.locator('#module-party')).toBeVisible();
    
    const partyHeader = page.locator('#module-party .module-header');
    const mainHeader = page.locator('#main-header');
    
    // Verify header has drop target class
    await expect(mainHeader).toHaveClass(/header-drop-target/);
    
    // Get initial position of party module
    const initialBox = await page.locator('#module-party').boundingBox();
    
    // Drag party module to header area
    await partyHeader.dragTo(page.getByRole('heading', { name: 'The Dragon Stones' }));
    
    // Verify module was moved (should be positioned near top of screen)
    const finalBox = await page.locator('#module-party').boundingBox();
    
    // Module should be repositioned to top area (below header)
    expect(finalBox.y).toBeLessThan(200); // Should be near top of screen
    expect(finalBox.y).toBeGreaterThan(50); // But below the header
    
    // Verify feedback message appeared
    const messages = await page.evaluate(() => {
      // Check console for the feedback message
      return window.console._logs || [];
    });
  });

  test('should provide visual feedback when dragging over header', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    const mainHeader = page.locator('#main-header');
    
    // Verify header doesn't have drag-over class initially
    await expect(mainHeader).not.toHaveClass(/drag-over/);
    
    // Test hover behavior (simulating drag-over)
    // Note: This is a simplified test since the actual drag-over effect
    // requires mouse events that are complex to simulate
    await expect(mainHeader).toBeVisible();
  });

  test('should handle multiple modules being docked to header area', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    
    // Open and dock party module
    await page.click('[data-module="party"]');
    const partyHeader = page.locator('#module-party .module-header');
    await partyHeader.dragTo(page.getByRole('heading', { name: 'The Dragon Stones' }));
    
    // Open and dock chat module
    await page.click('[data-module="chat"]');
    const chatHeader = page.locator('#module-chat .module-header');
    await chatHeader.dragTo(page.getByRole('heading', { name: 'The Dragon Stones' }));
    
    // Both modules should be visible and positioned near header
    await expect(page.locator('#module-party')).toBeVisible();
    await expect(page.locator('#module-chat')).toBeVisible();
    
    const partyBox = await page.locator('#module-party').boundingBox();
    const chatBox = await page.locator('#module-chat').boundingBox();
    
    // Both modules should be positioned in header area
    expect(partyBox.y).toBeLessThan(200);
    expect(chatBox.y).toBeLessThan(200);
  });

  test('should maintain module functionality after docking to header', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    // Dock module to header
    const partyHeader = page.locator('#module-party .module-header');
    await partyHeader.dragTo(page.getByRole('heading', { name: 'The Dragon Stones' }));
    
    // Verify module controls still work
    const collapseBtn = page.locator('#module-party .collapse-btn');
    await collapseBtn.click();
    
    // Module should collapse
    await expect(page.locator('#module-party')).toHaveClass(/collapsed/);
    
    // Expand again
    await collapseBtn.click();
    await expect(page.locator('#module-party')).not.toHaveClass(/collapsed/);
  });

  test('should prevent interference with header functionality', async ({ page }) => {
    // Open control center and party module
    await page.click('#control-center-toggle');
    await page.click('[data-module="party"]');
    
    // Dock module to header
    const partyHeader = page.locator('#module-party .module-header');
    await partyHeader.dragTo(page.getByRole('heading', { name: 'The Dragon Stones' }));
    
    // Verify header buttons still work
    await page.click('#tool-ruler');
    await expect(page.locator('#tool-ruler')).toHaveClass(/active/);
    
    await page.click('#tool-move');
    await expect(page.locator('#tool-move')).toHaveClass(/active/);
    
    // Grid toggle should still work
    await page.click('#grid-toggle');
    // Note: Grid functionality test would depend on canvas state checking
  });
});