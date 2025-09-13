# Module Drag-and-Drop Jump Fix Summary

## Problem
Modules were jumping downward by the header height when drag operations started. This happened because the drag offset was calculated using the entire module's bounding rectangle instead of just the header where the drag actually begins.

## Root Cause
In `index.html` around line 3823, the code was using:
```javascript
const rect = moduleElement.getBoundingClientRect();
clickOffsetX = e.clientX - rect.left;
clickOffsetY = e.clientY - rect.top;
```

This calculated the click offset relative to the top-left corner of the entire module, but since users only click on the header (which is positioned lower in the module), this caused an incorrect offset calculation.

## Solution
Changed the offset calculation to use the header element:
```javascript
const rect = header.getBoundingClientRect();
clickOffsetX = e.clientX - rect.left;
clickOffsetY = e.clientY - rect.top;
```

Additionally, separated the dimension caching to use the full module size for boundary checking:
```javascript
const moduleRect = moduleElement.getBoundingClientRect();
moduleStartWidth = moduleRect.width;
moduleStartHeight = moduleRect.height;
```

## Impact
- ✅ Fixed for all 7 module types: Party, Initiative, Tokens, Maps, Tools, Chat, Dice
- ✅ Modules now follow mouse pointer precisely without jumping
- ✅ Drag behavior is smooth and intuitive regardless of header height or padding
- ✅ Maintains proper boundary checking and resizing functionality

## Testing
1. **Logic verification**: Created `test_drag_fix.js` showing 30px jump elimination
2. **Visual demonstration**: Created `demo_fix.html` comparing fixed vs buggy behavior  
3. **End-to-end test**: Created `tests/e2e/drag.spec.js` for automated testing
4. **Manual verification**: Served application locally and tested all module types

## Files Modified
- `index.html` - Main fix applied at lines 3823 and 3832-3834

## Result
The drag-and-drop functionality now works as users expect - clicking and dragging a module header moves the module smoothly without any unwanted jumping or offset issues.