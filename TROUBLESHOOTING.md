# BattleMap Troubleshooting Guide

## Setup and Installation

### Quick Start
1. Clone the repository
2. Open `index.html` in a modern web browser
3. Or serve via HTTP server: `python -m http.server 8000`

### System Requirements
- **Browser**: Chrome/Firefox/Safari (latest 2 versions)
- **JavaScript**: ES6+ support required
- **Canvas**: HTML5 Canvas 2D context support
- **File API**: Drag-and-drop and file upload support

## Common Issues and Solutions

### Browser-Related Issues

#### Issue: Application doesn't load or shows blank screen
**Symptoms**: 
- Blank white page
- Console errors about JavaScript
- Missing functionality

**Solutions**:
1. **Check Browser Compatibility**
   ```bash
   # Ensure you're using a modern browser
   # Chrome 80+, Firefox 75+, Safari 13+
   ```

2. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Firefox: Ctrl+Shift+Delete → Clear everything
   - Safari: Develop → Empty Caches

3. **Check Console for Errors**
   - Press F12 to open Developer Tools
   - Look for red error messages in Console tab
   - Common fixes:
     ```javascript
     // If you see CORS errors, serve via HTTP server
     python -m http.server 8000
     # Then visit http://localhost:8000/index.html
     ```

4. **Disable Browser Extensions**
   - Ad blockers may block functionality
   - Try incognito/private mode

#### Issue: Features not working (tokens, dice, chat)
**Symptoms**:
- Buttons don't respond
- Panels don't switch
- Chat messages don't send

**Solutions**:
1. **Refresh the page** - Simple but often effective
2. **Check Developer Console** for JavaScript errors
3. **Verify File Integrity**
   ```bash
   # Check if index.html is complete
   wc -l index.html  # Should show ~2500+ lines
   ```

### Canvas and Rendering Issues

#### Issue: Map/canvas not displaying correctly
**Symptoms**:
- Black or gray canvas area
- Grid not showing
- Tokens not appearing

**Solutions**:
1. **Browser Canvas Support**
   ```javascript
   // Test in browser console:
   var canvas = document.createElement('canvas');
   var ctx = canvas.getContext('2d');
   console.log(ctx ? 'Canvas supported' : 'Canvas not supported');
   ```

2. **Hardware Acceleration**
   - Chrome: Settings → Advanced → System → Use hardware acceleration
   - Firefox: about:config → layers.acceleration.force-enabled → true

3. **Memory Issues**
   - Close other browser tabs
   - Restart browser
   - Check available RAM

#### Issue: Background map won't upload
**Symptoms**:
- Upload button doesn't work
- File selection dialog doesn't appear
- Images don't display on canvas

**Solutions**:
1. **File Format Support**
   - Supported: PNG, JPG, JPEG, GIF, WebP
   - Max file size: ~50MB (browser dependent)

2. **Browser File API**
   ```javascript
   // Test in console:
   console.log(typeof FileReader !== 'undefined' ? 'File API supported' : 'File API not supported');
   ```

3. **Security Restrictions**
   - Serve via HTTP server if loading from file://
   - Check CORS settings if using external images

### UI and Interaction Issues

#### Issue: Floating windows not movable/resizable
**Symptoms**:
- Chat window stuck in place
- Can't resize panels
- Dragging not working

**Solutions**:
1. **Touch Device Issues**
   - Use mouse for desktop features
   - Some touch interactions may not work as expected

2. **CSS/JavaScript Conflicts**
   - Check for browser extensions affecting CSS
   - Try in incognito mode

3. **Reset Window Position**
   ```javascript
   // Run in console to reset chat window:
   const chatWindow = document.getElementById('chat-window');
   chatWindow.style.left = '20px';
   chatWindow.style.top = '20px';
   chatWindow.style.width = '400px';
   chatWindow.style.height = '300px';
   ```

#### Issue: Panels not switching or content not loading
**Symptoms**:
- Tab clicks don't change content
- Panel content appears empty
- JavaScript errors in console

**Solutions**:
1. **Panel State Reset**
   ```javascript
   // Reset panel system in console:
   showPanel('party');  // Replace 'party' with desired panel
   ```

2. **Clear Application State**
   ```javascript
   // Clear localStorage data:
   localStorage.clear();
   location.reload();
   ```

### Backend Server Issues (if using Python backend)

#### Issue: Backend server won't start
**Symptoms**:
- FastAPI server errors
- Port conflicts
- Database connection issues

**Solutions**:
1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   ```bash
   # Create .env file in backend directory
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=battlemap
   CORS_ORIGINS=http://localhost:3000,http://localhost:8000
   ```

3. **Port Conflicts**
   ```bash
   # Check if port is in use
   lsof -i :8000
   # Kill process or use different port
   uvicorn server:app --port 8001
   ```

4. **Database Connection**
   ```bash
   # Test MongoDB connection
   mongosh mongodb://localhost:27017
   ```

### Performance Issues

#### Issue: Application running slowly
**Symptoms**:
- Laggy canvas interactions
- Slow panel switching
- High CPU usage

**Solutions**:
1. **Reduce Canvas Quality**
   - Lower zoom levels
   - Smaller background images
   - Fewer tokens on screen

2. **Browser Optimization**
   - Close unused tabs
   - Disable unnecessary extensions
   - Update browser to latest version

3. **Hardware Requirements**
   - Minimum: 4GB RAM, integrated graphics
   - Recommended: 8GB+ RAM, dedicated graphics

## Testing and Debugging

### Manual Testing Checklist
- [ ] Application loads without errors
- [ ] All panels switch correctly (Party, Initiative, Dice, Tokens)
- [ ] Canvas pan and zoom works
- [ ] Token creation and movement
- [ ] Chat functionality
- [ ] File upload system
- [ ] Floating window drag/resize

### Debug Mode
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Use Network tab to monitor requests
4. Elements tab to inspect UI state

### Console Commands for Debugging
```javascript
// Check application state
console.log(appState);

// Test canvas context
const canvas = document.getElementById('battle-canvas');
const ctx = canvas.getContext('2d');
console.log('Canvas context:', ctx);

// Reset to default state
showPanel('party');
appState.zoom = 1.0;
redrawCanvas();

// Check for missing elements
console.log('Chat window:', document.getElementById('chat-window'));
console.log('Sidebar panel:', document.getElementById('sidebar-panel'));
```

## Browser-Specific Notes

### Chrome
- Best performance and compatibility
- Hardware acceleration recommended
- File API fully supported

### Firefox
- Good compatibility
- May need to enable hardware acceleration
- Some CSS animations may differ slightly

### Safari
- Generally compatible
- File upload may behave differently
- Some ES6 features may need polyfills for older versions

### Edge
- Modern Edge (Chromium-based) fully supported
- Legacy Edge not recommended

## Getting Help

1. **Check Console Errors** - Always start here
2. **Try Incognito Mode** - Rules out extension conflicts
3. **Test in Different Browser** - Isolates browser-specific issues
4. **Clear Cache and Data** - Fixes most persistent issues
5. **Check File Integrity** - Ensure complete download/clone

## Reporting Issues

When reporting problems, please include:
- Browser name and version
- Operating system
- Console error messages (if any)
- Steps to reproduce the issue
- Expected vs actual behavior

## Future Improvements

### Planned Testing Infrastructure
- Automated browser testing with Playwright
- Cross-browser compatibility testing
- Performance monitoring
- Accessibility testing

### Monitoring and Diagnostics
Future versions will include:
- Automatic error reporting
- Performance metrics
- Browser compatibility detection
- Diagnostic tools for troubleshooting