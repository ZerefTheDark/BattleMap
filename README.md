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

### 👥 Party & Campaign Management
- **Party Manager**: Track party members, HP, levels, and character details
- **Initiative Tracker**: Automated initiative rolling and turn management
- **Character Integration**: Seamless connection between party members and tokens

### 🎲 Advanced Dice System
- **Static Dice Roller**: Dedicated panel with standard and custom dice
- **Chat Integration**: Enhanced chat with /roll commands and quick dice buttons  
- **Recent Rolls History**: Track all dice rolls in the dedicated panel
- **Multiple Dice Types**: Support for all standard D&D dice and custom combinations

### 📊 D&D Beyond Character Sheets
- **Complete Character Sheets**: Full D&D 5e character information display
- **Multiple Tabs**: Overview, Actions, Spells, Inventory, Features, Description, Notes, and Extras
- **Real-time Stats**: Health tracking, ability scores, combat stats, and modifiers
- **Token Integration**: Click tokens to view associated character sheets

#### Character Sheet Tabs
- **Overview**: Health, ability scores, combat stats, character info
- **Actions**: Combat actions, attacks, spells, and class features
- **Spells**: Spell management and casting (planned)
- **Inventory**: Equipment and item management (planned)
- **Features**: Class features, racial traits, and feats (planned)
- **Description**: Character roleplay information (planned)
- **Notes**: Session notes and custom information
- **Extras**: Companions, wild shapes, and advanced features (planned)

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

1. **Open the Application**: Load `index.html` in a modern web browser
2. **Add Tokens**: Select the Token tool and click on the map
3. **Upload Campaign**: Click the 📂 button to import D&D Beyond files
4. **View Character Sheets**: Click on tokens to open detailed character information
5. **Use Tools**: Switch between Pan, Ruler, Fog, and Token tools as needed

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
