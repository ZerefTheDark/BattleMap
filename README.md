# The Dragon Stones - BattleMap

A D&D battle map application with integrated D&D Beyond-style character sheets and campaign import functionality.

## Features

### 🗺️ Interactive Battle Map
- **Pan & Zoom**: Navigate your battlefield with smooth camera controls
- **Grid System**: Toggle grid overlay for precise positioning
- **Token Management**: Add, select, and manage player and enemy tokens
- **Tools**: Pan/Move, Ruler, Fog of War, and Token placement tools

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
- **Chat System**: Real-time messaging with system notifications
- **Dice Roller**: Quick dice rolls with `/roll` commands
- **Initiative Tracking**: Built into chat panel
- **File Management**: Upload and organize campaign assets

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

### Token Management
- **Add Tokens**: Select Token tool and click on map
- **Select Tokens**: Click on existing tokens (Move tool)
- **Character Sheets**: Selected tokens open detailed character information

### File Uploads
- **Campaign Files**: Drag JSON, XML, or ZIP files to import races, classes, items, spells
- **Enemy PDFs**: Upload PDF stat blocks for reference during combat
- **Processing**: Files are processed locally with feedback in chat

### Character Sheets
- **Navigation**: Use tabs to switch between different character information
- **Data**: View health, stats, combat info, and character details
- **Actions**: Combat actions and spell casting information
- **Full View**: Expand character sheet to full screen (planned)

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
- [ ] Advanced spell slot tracking
- [ ] Inventory management with drag & drop
- [ ] Combat automation and calculations
- [ ] Cloud storage and synchronization
- [ ] Advanced map features (layers, dynamic lighting)
- [ ] Character builder integration
- [ ] Campaign management tools

## License

This project is part of the Dragon Stones campaign system.
