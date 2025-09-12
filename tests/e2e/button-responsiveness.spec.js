import { test, expect } from '@playwright/test';

test.describe('BattleMap Button Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    // Wait for initial setup and welcome messages
    await page.waitForTimeout(1500);
  });

  test('should have no JavaScript errors on load', async ({ page }) => {
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    expect(errors).toHaveLength(0);
  });

  test('should respond to tool selection buttons', async ({ page }) => {
    // Test Move tool (should be default)
    await expect(page.locator('#tool-move')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#current-tool')).toContainText('Move');
    
    // Test Ruler tool
    await page.click('#tool-ruler');
    await expect(page.locator('#tool-ruler')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tool-move')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#current-tool')).toContainText('Ruler');
    
    // Test Fog tool
    await page.click('#tool-fog');
    await expect(page.locator('#tool-fog')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#current-tool')).toContainText('Fog');
    
    // Fog submenu should appear
    await expect(page.locator('#fog-submenu')).toBeVisible();
    
    // Test fog mode selection
    await page.click('[data-fog-mode="cone"]');
    await expect(page.locator('[data-fog-mode="cone"]')).toHaveClass(/active/);
  });

  test('should respond to sidebar panel tabs', async ({ page }) => {
    // Test Party panel (should be default)
    await expect(page.locator('[data-panel="party"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-content')).toContainText('Party Manager');
    
    // Test Initiative panel
    await page.click('[data-panel="initiative"]');
    await expect(page.locator('[data-panel="initiative"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-content')).toContainText('Initiative Tracker');
    
    // Test Dice panel
    await page.click('[data-panel="dice"]');
    await expect(page.locator('[data-panel="dice"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-content')).toContainText('Dice Roller');
    
    // Test Tokens panel
    await page.click('[data-panel="tokens"]');
    await expect(page.locator('[data-panel="tokens"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-content')).toContainText('Token Maker');
  });

  test('should respond to zoom controls', async ({ page }) => {
    // Check initial zoom
    await expect(page.locator('#zoom-badge')).toContainText('100%');
    
    // Test zoom in
    await page.click('#zoom-in');
    await expect(page.locator('#zoom-badge')).toContainText('120%');
    
    // Test zoom out
    await page.click('#zoom-out');
    await expect(page.locator('#zoom-badge')).toContainText('100%');
  });

  test('should respond to grid toggle', async ({ page }) => {
    // Grid should be on by default
    await expect(page.locator('#grid-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#grid-status')).toContainText('On');
    
    // Toggle grid off
    await page.click('#grid-toggle');
    await expect(page.locator('#grid-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#grid-status')).toContainText('Off');
    
    // Toggle back on
    await page.click('#grid-toggle');
    await expect(page.locator('#grid-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#grid-status')).toContainText('On');
  });

  test('should respond to control center toggle', async ({ page }) => {
    // Control center should be hidden initially
    await expect(page.locator('#control-center')).toBeHidden();
    
    // Open control center
    await page.click('#control-center-toggle');
    await expect(page.locator('#control-center')).toBeVisible();
    await expect(page.locator('#control-center')).toContainText('Control Center');
    
    // Should show tools tab by default
    await expect(page.locator('[data-control-tab="tools"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#control-content')).toContainText('Tool Selection');
    
    // Close control center
    await page.click('#control-center-close');
    await expect(page.locator('#control-center')).toBeHidden();
  });

  test('should respond to dice roller buttons', async ({ page }) => {
    // Navigate to dice panel
    await page.click('[data-panel="dice"]');
    
    // Test standard dice button
    const messages = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('[dice]')) {
        messages.push(msg.text());
      }
    });
    
    await page.click('[data-dice="1d20"]');
    
    // Wait for dice roll to be logged
    await page.waitForTimeout(500);
    
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toContain('Rolling 1d20');
    
    // Test custom dice input
    await page.fill('#custom-dice-input', '2d6+3');
    await page.click('#roll-custom-dice');
    
    await page.waitForTimeout(500);
    
    expect(messages.length).toBeGreaterThan(1);
    expect(messages[messages.length - 1]).toContain('Rolling 2d6+3');
  });

  test('should respond to upload modal', async ({ page }) => {
    // Open upload modal
    await page.click('#upload-campaign');
    await expect(page.locator('#upload-modal')).toBeVisible();
    await expect(page.locator('#upload-modal')).toContainText('Upload D&D Beyond Campaign');
    
    // Close modal
    await page.click('#close-upload-modal');
    await expect(page.locator('#upload-modal')).toBeHidden();
  });

  test('should respond to control center tabs', async ({ page }) => {
    // Open control center
    await page.click('#control-center-toggle');
    await expect(page.locator('#control-center')).toBeVisible();
    
    // Test Chat tab
    await page.click('[data-control-tab="chat"]');
    await expect(page.locator('[data-control-tab="chat"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#control-content')).toContainText('Chat Messages');
    
    // Test Dice tab
    await page.click('[data-control-tab="dice"]');
    await expect(page.locator('[data-control-tab="dice"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#control-content')).toContainText('Dice Roller');
    
    // Test Panels tab
    await page.click('[data-control-tab="panels"]');
    await expect(page.locator('[data-control-tab="panels"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#control-content')).toContainText('Quick Panel Access');
  });

  test('should respond to token maker features', async ({ page }) => {
    // Navigate to tokens panel
    await page.click('[data-panel="tokens"]');
    
    // Test color selection
    await page.click('[data-color="#3b82f6"]');
    await expect(page.locator('[data-color="#3b82f6"]')).toHaveClass(/selected/);
    
    // Test size slider
    await page.locator('#token-size').fill('30');
    await expect(page.locator('#size-display')).toContainText('30');
    
    // Test name input
    await page.fill('#token-name', 'Test Character');
    await expect(page.locator('#token-name')).toHaveValue('Test Character');
    
    // Test create token button
    await page.click('#create-token');
    
    // Should update token count
    await expect(page.locator('#token-count')).toContainText('1');
  });

  test('should handle party manager features', async ({ page }) => {
    // Navigate to party panel
    await page.click('[data-panel="party"]');
    
    // Should show empty state initially
    await expect(page.locator('#panel-content')).toContainText('No party members yet');
    
    // Test add member button
    await page.click('#add-party-member');
    
    // Should add a new member
    await expect(page.locator('#panel-content')).toContainText('New Member');
  });

  test('should handle initiative tracker features', async ({ page }) => {
    // Navigate to initiative panel
    await page.click('[data-panel="initiative"]');
    
    // Should show empty state initially
    await expect(page.locator('#panel-content')).toContainText('No initiative order set');
    
    // Test roll initiative button
    await page.click('#roll-initiative');
    
    // Should still show empty if no party members/tokens
    await expect(page.locator('#panel-content')).toContainText('No initiative order set');
  });
});

test.describe('BattleMap Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('should maintain state across different interactions', async ({ page }) => {
    // Set fog tool
    await page.click('#tool-fog');
    await expect(page.locator('#current-tool')).toContainText('Fog');
    
    // Switch to dice panel
    await page.click('[data-panel="dice"]');
    
    // Tool should still be fog
    await expect(page.locator('#current-tool')).toContainText('Fog');
    
    // Open control center
    await page.click('#control-center-toggle');
    
    // Tool selection in control center should reflect current tool
    await expect(page.locator('#control-content')).toContainText('Tool Selection');
    
    // Switch tool via control center
    await page.click('[data-tool="move"]');
    
    // Should update main toolbar
    await expect(page.locator('#current-tool')).toContainText('Move');
    await expect(page.locator('#tool-move')).toHaveAttribute('aria-pressed', 'true');
  });
});