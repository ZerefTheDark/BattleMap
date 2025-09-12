import { test, expect } from '@playwright/test';

test.describe('BattleMap UI Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application successfully', async ({ page }) => {
    // Check that the main elements are present
    await expect(page.locator('h1')).toContainText('The Dragon Stones');
    await expect(page.locator('#battle-canvas')).toBeVisible();
    await expect(page.locator('#sidebar-panel')).toBeVisible();
    await expect(page.locator('#chat-window')).toBeVisible();
  });

  test('should switch between sidebar panels', async ({ page }) => {
    // Test Party panel (should be active by default)
    await expect(page.locator('[data-panel="party"]')).toHaveClass(/active/);
    await expect(page.locator('#panel-content')).toContainText('Party Manager');

    // Switch to Initiative panel
    await page.click('[data-panel="initiative"]');
    await expect(page.locator('[data-panel="initiative"]')).toHaveClass(/active/);
    await expect(page.locator('#panel-content')).toContainText('Initiative Tracker');

    // Switch to Dice panel  
    await page.click('[data-panel="dice"]');
    await expect(page.locator('[data-panel="dice"]')).toHaveClass(/active/);
    await expect(page.locator('#panel-content')).toContainText('Dice Roller');

    // Switch to Tokens panel
    await page.click('[data-panel="tokens"]');
    await expect(page.locator('[data-panel="tokens"]')).toHaveClass(/active/);
    await expect(page.locator('#panel-content')).toContainText('Token Maker');
  });

  test('should handle chat functionality', async ({ page }) => {
    // Type a message in chat
    await page.fill('#chat-input', 'Test message from automation');
    await page.click('#send-chat');
    
    // Verify message appears in chat
    await expect(page.locator('#chat-messages')).toContainText('Test message from automation');
  });

  test('should toggle floating chat sidebar', async ({ page }) => {
    // Click the chat sidebar toggle
    await page.click('#chat-sidebar-toggle');
    
    // Verify sidebar expands
    await expect(page.locator('#chat-sidebar')).toHaveClass(/expanded/);
    
    // Click again to collapse
    await page.click('#chat-sidebar-toggle');
    
    // Verify sidebar collapses
    await expect(page.locator('#chat-sidebar')).not.toHaveClass(/expanded/);
  });

  test('should allow tool selection', async ({ page }) => {
    // Test move tool (should be active by default)
    await expect(page.locator('#tool-move')).toHaveAttribute('aria-pressed', 'true');
    
    // Switch to ruler tool
    await page.click('#tool-ruler');
    await expect(page.locator('#tool-ruler')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tool-move')).toHaveAttribute('aria-pressed', 'false');
    
    // Switch to fog tool
    await page.click('#tool-fog');
    await expect(page.locator('#tool-fog')).toHaveAttribute('aria-pressed', 'true');
  });

  test('should handle zoom controls', async ({ page }) => {
    // Test zoom in
    await page.click('#zoom-in');
    await expect(page.locator('#zoom-display')).toContainText('110%');
    
    // Test zoom out
    await page.click('#zoom-out');
    await expect(page.locator('#zoom-display')).toContainText('100%');
  });

  test('should toggle grid', async ({ page }) => {
    // Grid should be on by default
    await expect(page.locator('#grid-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#grid-status')).toContainText('On');
    
    // Toggle grid off
    await page.click('#grid-toggle');
    await expect(page.locator('#grid-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#grid-status')).toContainText('Off');
  });

  test('should show upload modal', async ({ page }) => {
    // Click upload button
    await page.click('#upload-campaign');
    
    // Verify modal appears
    await expect(page.locator('#upload-modal')).toBeVisible();
    await expect(page.locator('#upload-modal')).toContainText('Upload D&D Beyond Campaign');
    
    // Close modal
    await page.click('#close-upload-modal');
    await expect(page.locator('#upload-modal')).toBeHidden();
  });
});

test.describe('BattleMap UI Duplication Issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should identify duplicate chat/dice controls', async ({ page }) => {
    // Check for duplicate chat controls
    const chatButtons = page.locator('button:has-text("💬"), button[title*="chat"], button[aria-label*="chat"]');
    const chatButtonCount = await chatButtons.count();
    
    // Document the duplication for refactoring
    console.log(`Found ${chatButtonCount} chat-related buttons - should be consolidated`);
    
    // Check for duplicate dice controls  
    const diceButtons = page.locator('button:has-text("🎲"), button[title*="dice"], button[aria-label*="dice"]');
    const diceButtonCount = await diceButtons.count();
    
    console.log(`Found ${diceButtonCount} dice-related buttons - should be consolidated`);
  });

  test('should identify duplicate panel access points', async ({ page }) => {
    // Check sidebar tabs
    const sidebarTabs = page.locator('#sidebar-panel .btn-tab');
    const sidebarTabCount = await sidebarTabs.count();
    
    // Check chat sidebar tabs
    const chatSidebarTabs = page.locator('#chat-sidebar .chat-sidebar-tab');
    const chatSidebarTabCount = await chatSidebarTabs.count();
    
    console.log(`Sidebar tabs: ${sidebarTabCount}, Chat sidebar tabs: ${chatSidebarTabCount}`);
    console.log('These provide duplicate access to the same panels and should be consolidated');
  });
});