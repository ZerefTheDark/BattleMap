# The Dragon Stones - BattleMap with BattleGrounds Features

A D&D battle map application with integrated D&D Beyond-style character sheets, campaign import functionality, and enhanced BattleGrounds features merged for the ultimate tabletop experience.

## 🚀 Recent Merge: BattleGrounds Integration

This version represents a significant merge combining the advanced chat functionality and interface from BattleMap with the enhanced UI style and features from BattleGrounds. The integration includes:

### ✨ New BattleGrounds Features Added

- **🎯 Party Manager** - Manage party members, track HP, levels, and classes
- **⚡ Initiative Tracker** - Roll initiative for all participants and manage turn order
- **🎲 Static Dice Roller** - Dedicated dice rolling panel with custom rolls and recent history
- **🎨 Token Maker** - Advanced token creation with color selection, size adjustment, and type categorization
- **👁️ Enhanced Fog of War** - Multiple modes including brush, cone, circle, and clear tools
- **📦 Upload Expansion** - Ready for future modules and expansions
- **🏗️ Sidebar Panel System** - Organized tabbed interface for all new features

### 🔧 Technical Improvements

- **Unified Interface** - Clean tabbed sidebar system organizing all BattleGrounds features
- **Preserved Chat System** - Maintained the advanced floating/movable chat window from BattleMap
- **Enhanced UX** - Improved tool organization and visual feedback
- **Modular Design** - Easy to extend with future features and expansions

## Features

### 🗺️ Interactive Battle Map
- **Pan & Zoom**: Navigate your battlefield with smooth camera controls
- **Grid System**: Toggle grid overlay for precise positioning
- **Token Management**: Add, select, and manage player and enemy tokens with enhanced token maker
- **Enhanced Tools**: Pan/Move, Ruler, and advanced Fog of War with multiple modes
- **Map Management**: Create and manage multiple submaps with individual background images
- **Image Upload**: Upload and organize map images with gallery selection for easy reuse

### 👥 Party & Campaign Management
- **Party Manager**: Track party members, HP, levels, and character details
- **Initiative Tracker**: Automated initiative rolling and turn management
- **Character Integration**: Seamless connection between party members and tokens

### 🎲 Advanced Dice System
- **Static Dice Roller**: Dedicated panel with standard and custom dice
- **Chat Integration**: Enhanced chat with /roll commands and quick dice buttons  
- **Recent Rolls History**: Track all dice rolls in the dedicated panel
- **Multiple Dice Types**: Support for all standard D&D dice and custom combinations

### 📊 Enhanced D&D 5e Character Sheets
- **Comprehensive Character Sheets**: Complete D&D 5e character information display with all available details
- **8 Detailed Tabs**: Overview, Actions, Spells, Inventory, Features, Description, Notes, and Extras
- **Enhanced Character Data**: Hit dice, death saves, senses, movement speeds, resistances, proficiencies
- **Real-time Stats**: Health tracking, ability scores, combat stats, and modifiers
- **Token Integration**: Click tokens to view associated character sheets

#### Enhanced Character Sheet Tabs
- **Overview**: Health & vitality (HP, hit dice, death saves), ability scores, combat stats, movement & senses, appearance, proficiencies, resistances
- **Actions**: Character-specific actions, standard D&D actions, bonus actions, reactions with comprehensive descriptions
- **Spells**: Spellcasting info, spell slots tracking (levels 1-9), known spells with full details and components
- **Inventory**: Equipment with properties, currency tracking (all 5 types), carrying capacity management
- **Features**: Class features with usage tracking, racial traits, feats, saving throws, all 18 skills with expertise
- **Description**: Character backstory, personality traits (ideals, bonds, flaws), relationships, organizations
- **Notes**: Session notes, quick reference guide, character-specific reminders
- **Extras**: Companions, wild shape forms, magical items, custom abilities, vehicles, additional resources

### 📂 Campaign Import System
- **D&D Beyond Integration**: Upload campaign files (JSON, XML, ZIP)
- **Drag & Drop Interface**: Easy file upload with visual feedback
- **PDF Support**: Enemy stat blocks and reference materials
- **File Processing**: Automatic parsing with error handling

### 🎲 Integrated Tools
- **Advanced Chat System**: Floating/movable window with real-time messaging
- **Comprehensive Dice Rolling**: Both chat commands and dedicated static roller
- **Initiative Tracking**: Built into both chat panel and dedicated tracker
- **File Management**: Upload and organize campaign assets and expansions
- **Token Creation**: Advanced token maker with customization options

## Getting Started

### Quick Start
1. Clone or download the repository
   ```bash
   git clone https://github.com/ZerefTheDark/BattleMap.git
   cd BattleMap
   ```

2. **Option A: Direct Browser Access**
   - Open `index.html` directly in your web browser
   - All features work without a server for basic usage

3. **Option B: HTTP Server (Recommended)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have it installed)
   npx serve .
   ```
   Then visit: `http://localhost:8000/index.html`

4. Start creating your battle maps!

### Backend Setup (Optional)
For advanced features like data persistence:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

### Testing Setup (For Developers)
```bash
# Install testing dependencies
npm install

# Install browsers for testing
npm run install:browsers

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### First Steps
1. **Add Tokens**: Select the Token tool and click on the map
2. **Upload Campaign**: Click the 📂 button to import D&D Beyond files
3. **View Character Sheets**: Click on tokens to open detailed character information
4. **Use Tools**: Switch between Pan, Ruler, Fog, and Token tools as needed

## Usage Guide

### Basic Navigation
- **Pan**: Select Move tool and drag the map
- **Zoom**: Use zoom controls or mouse wheel
- **Grid**: Toggle grid overlay with the Grid button

### Enhanced Sidebar Features
- **Party Manager**: Add party members, track HP and stats
- **Initiative Tracker**: Roll initiative for all participants, manage turns
- **Dice Roller**: Use the dedicated static dice roller with custom inputs
- **Token Maker**: Create detailed tokens with custom colors, sizes, and types

### Advanced Token Management
- **Create Tokens**: Use the Token Maker panel for detailed customization
- **Quick Tokens**: Select Token tool and click on map for instant placement
- **Select Tokens**: Click on existing tokens (Move tool) to view character sheets
- **Update Tokens**: Select a token and use Token Maker to modify properties

### Enhanced Fog of War
- **Brush Mode**: Paint fog areas with brush tool
- **Cone Mode**: Create cone-shaped fog areas
- **Circle Mode**: Create circular fog areas  
- **Clear Mode**: Remove fog from specific areas

### Map Management & Image Upload
- **Create New Maps**: Click "New Map" button to create submaps with optional background images
- **Image Upload**: Upload new images directly when creating maps via drag & drop or file browser
- **Image Gallery**: Select from previously uploaded images when creating new maps
- **Background Images**: Each map can have its own background image independent of others
- **Map Switching**: Seamlessly switch between different maps while preserving individual settings
- **Map Organization**: Main map and submaps are clearly organized with status indicators

#### Creating Maps with Images
1. **New Map Creation**: Click the "New Map" button in the Maps panel
2. **Choose Image Option**: 
   - **Upload New**: Drag & drop or browse for a new image file
   - **Select Existing**: Choose from previously uploaded images in the gallery
3. **Map Configuration**: Enter map name and optionally select/upload a background image
4. **Create & Switch**: Maps are created instantly and can be switched between easily

### File Uploads
- **Campaign Files**: Drag JSON, XML, or ZIP files to import races, classes, items, spells
- **Enemy PDFs**: Upload PDF stat blocks for reference during combat
- **Expansion Uploads**: Use the Upload Expansion button for future modules
- **Processing**: Files are processed locally with feedback in chat

### Character Sheets
- **Navigation**: Use tabs to switch between different character information
- **Data**: View health, stats, combat info, and character details
- **Actions**: Combat actions and spell casting information
- **Integration**: Seamless connection with party manager and initiative tracker

## Technical Features

### Architecture
- **Single File**: Self-contained HTML with embedded CSS and JavaScript
- **No Dependencies**: Pure JavaScript implementation
- **Local Storage**: Client-side file processing and storage
- **Responsive**: Works on desktop, tablet, and mobile devices

### File Support
- **Campaign Files**: JSON, XML, ZIP formats
- **PDFs**: Enemy stat blocks and reference materials
- **Images**: Character portraits and tokens (planned)

### Browser Compatibility
- Modern browsers with ES6 support
- Canvas 2D context for map rendering
- File API for drag & drop uploads
- CSS Grid and Flexbox for responsive layout

## Troubleshooting

Having issues? Check our comprehensive [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for:

### Quick Fixes
- **Blank screen**: Try serving via HTTP server instead of opening file directly
- **Features not working**: Check browser console (F12) for JavaScript errors
- **Upload issues**: Ensure browser supports File API and try smaller files
- **Performance issues**: Close other browser tabs and check hardware acceleration

### Common Issues
- Browser compatibility problems
- Canvas rendering issues  
- File upload failures
- UI interaction problems
- Backend server setup

### Testing and Debugging
```bash
# Run automated tests
npm test

# Debug specific issues
npm run test:debug

# Test in different browsers
npm run test:headed
```

For detailed troubleshooting steps, error messages, and solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Development

See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for detailed technical documentation, including:
- Character sheet data structure
- UI/UX design patterns
- File upload system
- Integration guidelines
- Performance considerations

## Dragon Stones Theme

The application features a fantasy D&D theme with:
- **Color Palette**: Emerald green and gold accents on dark backgrounds
- **Typography**: Fantasy-appropriate fonts and styling
- **Visual Effects**: Glows, gradients, and magical aesthetics
- **Icons**: Thematic emojis for tools and features

## Future Features

- [ ] Real-time multiplayer collaboration
- [ ] Enhanced fog of war rendering and persistence
- [ ] Advanced spell slot tracking in party manager
- [ ] Inventory management with drag & drop
- [ ] Combat automation and calculations
- [ ] Cloud storage and synchronization
- [ ] Dynamic lighting and advanced map features
- [ ] Character builder integration
- [ ] Expansion module system
- [ ] Advanced initiative effects and conditions

## Development & Contributing

This project represents a successful merge of BattleMap's advanced chat system with BattleGrounds' comprehensive feature set. The unified codebase maintains the best of both applications while providing a consistent user experience.

### For Future Contributors
- The sidebar panel system is easily extensible for new modules
- All features follow the established Dragon Stones theming
- Panel content is dynamically generated and modular
- Enhanced fog of war system ready for visual improvements
- Token system supports advanced customization

### Architecture Highlights
- **Single File**: Self-contained HTML with embedded CSS and JavaScript
- **Modular Panels**: Easy to add new tabbed features
- **Event-Driven**: Comprehensive event handling for all interactions
- **State Management**: Centralized app state for all features
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## License

This project is part of the Dragon Stones campaign system.
