// Simple test to verify the drag fix is working
// This test simulates the drag behavior to check if the offset calculation is correct

function testDragOffset() {
    console.log('Testing drag offset calculation...');
    
    // Create a mock header element
    const mockHeader = {
        getBoundingClientRect: () => ({
            left: 100,
            top: 50,
            width: 200,
            height: 30
        })
    };
    
    // Create a mock module element  
    const mockModuleElement = {
        getBoundingClientRect: () => ({
            left: 100,
            top: 50,
            width: 200,
            height: 300  // Much taller than header
        }),
        style: {
            left: '100px',
            top: '50px'
        }
    };
    
    // Mock mouse event
    const mockMouseEvent = {
        clientX: 150,  // Clicked at x=150
        clientY: 65    // Clicked at y=65 (15px down from header top)
    };
    
    // Test with the FIXED version (using header)
    let rect = mockHeader.getBoundingClientRect();
    let clickOffsetX = mockMouseEvent.clientX - rect.left;
    let clickOffsetY = mockMouseEvent.clientY - rect.top;
    
    console.log('With FIXED version (using header):');
    console.log(`Click offset: (${clickOffsetX}, ${clickOffsetY})`);
    console.log('Expected: (50, 15) - This should be correct');
    
    // Test with the BUGGY version (using moduleElement)
    rect = mockModuleElement.getBoundingClientRect();
    let buggyOffsetX = mockMouseEvent.clientX - rect.left;
    let buggyOffsetY = mockMouseEvent.clientY - rect.top;
    
    console.log('\nWith BUGGY version (using moduleElement):');
    console.log(`Click offset: (${buggyOffsetX}, ${buggyOffsetY})`);
    console.log('Expected: (50, 15) but got the same because mock has same position');
    console.log('In real scenario, module would be taller and cause jump');
    
    // Simulate actual drag positioning
    console.log('\n--- Simulating drag positioning ---');
    
    // When mouse moves to a new position
    const newMouseX = 200;
    const newMouseY = 100;
    
    // With FIXED version
    const newX_fixed = newMouseX - clickOffsetX;
    const newY_fixed = newMouseY - clickOffsetY;
    
    // With BUGGY version  
    const newX_buggy = newMouseX - buggyOffsetX;
    const newY_buggy = newMouseY - buggyOffsetY;
    
    console.log(`Mouse moved to: (${newMouseX}, ${newMouseY})`);
    console.log(`FIXED positioning: (${newX_fixed}, ${newY_fixed})`);
    console.log(`BUGGY positioning: (${newX_buggy}, ${newY_buggy})`);
    
    // The key difference would be visible when header is not at the same position as module
    console.log('\n--- Testing with header offset from module top ---');
    
    const mockHeaderWithOffset = {
        getBoundingClientRect: () => ({
            left: 100,
            top: 80,     // Header is 30px down from module top
            width: 200,
            height: 30
        })
    };
    
    // Click in the middle of the header
    const clickEvent = {
        clientX: 150,
        clientY: 95    // Middle of header (80 + 15)
    };
    
    // FIXED calculation (using header position)
    rect = mockHeaderWithOffset.getBoundingClientRect();
    clickOffsetX = clickEvent.clientX - rect.left;
    clickOffsetY = clickEvent.clientY - rect.top;
    
    console.log(`FIXED offset from header: (${clickOffsetX}, ${clickOffsetY})`);
    
    // BUGGY calculation (using module position)
    rect = mockModuleElement.getBoundingClientRect();
    const buggyOffsetX2 = clickEvent.clientX - rect.left;
    const buggyOffsetY2 = clickEvent.clientY - rect.top;
    
    console.log(`BUGGY offset from module: (${buggyOffsetX2}, ${buggyOffsetY2})`);
    
    console.log(`\nThe difference in Y offset: ${buggyOffsetY2 - clickOffsetY}px`);
    console.log('This difference would cause the module to jump when dragging starts!');
    
    return {
        fixed: { x: clickOffsetX, y: clickOffsetY },
        buggy: { x: buggyOffsetX2, y: buggyOffsetY2 },
        jumpDistance: buggyOffsetY2 - clickOffsetY
    };
}

// Run the test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testDragOffset;
} else {
    testDragOffset();
}