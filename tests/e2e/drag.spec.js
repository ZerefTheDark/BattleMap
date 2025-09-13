const { test, expect } = require('@playwright/test');

test('module drag does not jump when dragging starts', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:8000');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Open a module (e.g., Party Manager)
  await page.click('button:has-text("Party")');
  
  // Wait for the module to appear
  const moduleSelector = '.module-window';
  await page.waitForSelector(moduleSelector);
  
  // Get the module element
  const module = page.locator(moduleSelector).first();
  const header = module.locator('.module-header').first();
  
  // Get initial position of the module
  const initialBox = await module.boundingBox();
  const headerBox = await header.boundingBox();
  
  console.log('Initial module position:', initialBox);
  console.log('Header position:', headerBox);
  
  // Perform drag operation
  // Start drag from the middle of the header
  const startX = headerBox.x + headerBox.width / 2;
  const startY = headerBox.y + headerBox.height / 2;
  
  // Drag to a new position
  const endX = startX + 100;
  const endY = startY + 50;
  
  // Start the drag
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  
  // Get position immediately after mouse down (this is where jumping would occur)
  const positionAfterMouseDown = await module.boundingBox();
  
  // Move mouse slightly to trigger drag
  await page.mouse.move(endX, endY);
  
  // Get final position
  const finalBox = await module.boundingBox();
  
  // Calculate expected position (should be initial position + mouse movement - header offset)
  const expectedX = endX - (startX - initialBox.x);
  const expectedY = endY - (startY - initialBox.y);
  
  console.log('Position after mouse down:', positionAfterMouseDown);
  console.log('Final position:', finalBox);
  console.log('Expected position:', { x: expectedX, y: expectedY });
  
  // End the drag
  await page.mouse.up();
  
  // Check that there was no significant jumping
  // The module should not have jumped down by the header height
  const jumpX = Math.abs(positionAfterMouseDown.x - initialBox.x);
  const jumpY = Math.abs(positionAfterMouseDown.y - initialBox.y);
  
  console.log('Jump distance:', { x: jumpX, y: jumpY });
  
  // Allow small movements due to browser differences, but no large jumps
  expect(jumpX).toBeLessThan(5);
  expect(jumpY).toBeLessThan(5);
  
  // Check that final position is approximately correct
  const tolerance = 10;
  expect(Math.abs(finalBox.x - expectedX)).toBeLessThan(tolerance);
  expect(Math.abs(finalBox.y - expectedY)).toBeLessThan(tolerance);
});

test('multiple module types can be dragged without jumping', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await page.waitForLoadState('networkidle');
  
  const moduleTypes = ['Party', 'Initiative', 'Tokens', 'Maps'];
  
  for (const moduleType of moduleTypes) {
    console.log(`Testing ${moduleType} module...`);
    
    // Open the module
    await page.click(`button:has-text("${moduleType}")`);
    await page.waitForTimeout(500); // Small delay for module to appear
    
    // Find the specific module by its title
    const module = page.locator('.module-window').filter({ hasText: moduleType }).first();
    const header = module.locator('.module-header').first();
    
    // Get positions
    const initialBox = await module.boundingBox();
    const headerBox = await header.boundingBox();
    
    if (!initialBox || !headerBox) {
      console.log(`Skipping ${moduleType} - could not get bounding boxes`);
      continue;
    }
    
    // Perform a small drag
    const startX = headerBox.x + 20;
    const startY = headerBox.y + 15;
    const endX = startX + 30;
    const endY = startY + 20;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    const positionAfterMouseDown = await module.boundingBox();
    
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check for jumping
    const jumpY = Math.abs(positionAfterMouseDown.y - initialBox.y);
    
    console.log(`${moduleType} jump distance: ${jumpY}px`);
    expect(jumpY).toBeLessThan(5);
  }
});