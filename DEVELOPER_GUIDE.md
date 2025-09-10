# BattleMap Developer Guide: D&D Beyond Character Sheet Integration

## Overview

This guide details the implementation of D&D Beyond-style character sheets and campaign import functionality in BattleMap. The system provides a comprehensive digital character sheet experience similar to D&D Beyond's interface, integrated seamlessly into the battle map application.

## Architecture

### Core Components

1. **Application State Management** (`appState`)
2. **Modal System** (Upload, Character Sheet, PDF Viewer)
3. **Token System** (Enhanced with character data)
4. **File Upload System** (Campaign files and PDFs)
5. **Character Sheet Data Structure**

## Character Sheet Data Structure

### Core Character Object
```javascript
{
  id: Number,           // Unique token identifier
  name: String,         // Character display name
  type: 'player' | 'enemy',
  characterSheet: {
    // Basic Info
    name: String,
    level: Number,
    class: String,
    race: String,
    background: String,
    
    // Core Stats
    stats: {
      str: Number,      // Strength (8-20)
      dex: Number,      // Dexterity
      con: Number,      // Constitution
      int: Number,      // Intelligence
      wis: Number,      // Wisdom
      cha: Number       // Charisma
    },
    
    // Health System
    health: {
      current: Number,  // Current HP
      max: Number,      // Maximum HP
      temp: Number      // Temporary HP
    },
    
    // Combat Stats
    ac: Number,              // Armor Class
    speed: Number,           // Movement speed (feet)
    initiative: Number,      // Initiative modifier
    proficiencyBonus: Number,// Based on level
    
    // Saving Throws (proficiency flags)
    savingThrows: {
      str: Boolean, dex: Boolean, con: Boolean,
      int: Boolean, wis: Boolean, cha: Boolean
    },
    
    // Skills with modifiers
    skills: {
      acrobatics: Number, animalHandling: Number,
      arcana: Number, athletics: Number,
      deception: Number, history: Number,
      insight: Number, intimidation: Number,
      investigation: Number, medicine: Number,
      nature: Number, perception: Number,
      performance: Number, persuasion: Number,
      religion: Number, sleightOfHand: Number,
      stealth: Number, survival: Number
    },
    
    // Dynamic Arrays
    spells: Array,        // Spell objects
    inventory: Array,     // Item objects
    features: Array,      // Class/racial features
    notes: String         // Freeform notes
  },
  
  // Enemy-specific
  pdfUrl: String | null   // PDF reference for enemies
}
```

## Character Sheet Tabs

### 1. Overview Tab
**Purpose**: Primary character information and core stats

**Layout**: 2-column grid on large screens, single column on mobile

**Sections**:
- **Health Block**: Current/Max/Temp HP with large, prominent numbers
- **Ability Scores**: 3x2 grid showing STR, DEX, CON, INT, WIS, CHA with modifiers
- **Combat Stats**: AC, Initiative, Speed in horizontal layout
- **Character Info**: Race, Class, Level, Background, Proficiency Bonus

**Styling**: Uses `stat-block` class with green headers and proper contrast

### 2. Actions Tab
**Purpose**: Combat actions, attacks, and quick-use abilities

**Layout**: Vertical list of action cards

**Action Card Structure**:
```html
<div class="bg-gray-700 rounded p-3">
  <div class="font-semibold text-white">[Action Name]</div>
  <div class="text-sm text-gray-300">[Description/Stats]</div>
</div>
```

**Examples**:
- Weapon attacks with to-hit bonuses and damage
- Standard actions (Dash, Dodge, Help)
- Class features and spells
- Resource tracking

### 3. Spells Tab
**Purpose**: Spell management and casting

**Planned Features**:
- Spell slot tracking by level
- Prepared spells toggle
- Spell search and filtering
- Spellcasting ability display
- Ritual spell indicators

### 4. Inventory Tab
**Purpose**: Equipment and item management

**Planned Sections**:
- Equipped items (armor, weapons, shields)
- Backpack contents
- Currency tracking
- Item descriptions and properties
- Weight/encumbrance

### 5. Features & Traits Tab
**Purpose**: Class features, racial traits, and feats

**Organization**:
- Class features by level
- Racial traits
- Background features
- Feats and ASIs
- Feature descriptions and usage tracking

### 6. Description Tab
**Purpose**: Character roleplay information

**Sections**:
- Physical description
- Personality traits
- Ideals, bonds, flaws
- Backstory
- Allies and organizations

### 7. Notes Tab
**Purpose**: Session notes and custom information

**Features**:
- Editable text area
- DM notes (if applicable)
- Session log
- Custom reminders

### 8. Extras Tab
**Purpose**: Advanced features and companions

**Planned Content**:
- Animal companions
- Familiars
- Wild shape forms
- Multiclass features
- Custom additions

## UI/UX Design Patterns

### Visual Hierarchy
1. **Headers**: Green (`text-green-400`) for section titles
2. **Primary Text**: White (`text-white`) for main content
3. **Secondary Text**: Gray (`text-gray-300/400`) for descriptions
4. **Accent Colors**: Yellow (`text-yellow-400`) for modifiers and important values

### Component Patterns

#### Stat Blocks
```css
.stat-block {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  border-radius: 0.5rem;
  padding: 1rem;
}
```

#### Tab System
- Active tab: `active` class with yellow bottom border
- Hover effects for all tabs
- Responsive horizontal scrolling
- Clear visual feedback

#### Modal System
- Full-screen overlay with blur effect
- Centered content with max dimensions
- Consistent close button placement
- Background click to close

## File Upload System

### Campaign Files
**Supported Formats**: JSON, XML, ZIP
**Purpose**: Import character data, items, spells, monsters
**Processing**: Client-side parsing with error handling

### PDF Files
**Purpose**: Enemy stat blocks and reference materials
**Storage**: Browser object URLs
**Display**: Embedded iframe viewer

### Upload UI
- Drag & drop areas with visual feedback
- File type validation
- Progress indicators
- Upload confirmation in chat

## Integration Points

### Token System
- Enhanced token rendering with character names
- Selection states with visual feedback
- Click detection for character sheet opening
- Token-to-character data binding

### Chat System
- Upload notifications
- System messages for file processing
- Error reporting
- Feature announcements

### Canvas Integration
- Token positioning and movement
- Selection highlighting
- Context-sensitive actions
- Zoom and pan compatibility

## Styling Guidelines

### Color Palette
- **Primary**: `#10b981` (Green) - Actions, borders, accents
- **Secondary**: `#fbbf24` (Gold) - Highlights, modifiers, selections
- **Background**: `#1e293b` (Dark gray) - Main backgrounds
- **Surface**: `#374151` (Medium gray) - Cards, inputs
- **Text**: `#ffffff` (White), `#d1d5db` (Light gray), `#9ca3af` (Medium gray)

### Typography
- **Headers**: Bold, appropriate size hierarchy
- **Body**: Regular weight, good contrast
- **Monospace**: For dice rolls and technical info
- **Sizing**: Responsive with mobile considerations

### Layout Principles
- **Mobile-first**: Responsive design with mobile considerations
- **Grid Systems**: CSS Grid for complex layouts, Flexbox for simple ones
- **Spacing**: Consistent gap and padding using utility classes
- **Accessibility**: Proper contrast ratios and keyboard navigation

## Development Workflow

### Adding New Features
1. Extend character sheet data structure if needed
2. Update modal content generation functions
3. Add new tab content generators
4. Test with various character builds
5. Ensure mobile responsiveness

### Extending Tab Content
```javascript
function generateNewTab(sheet) {
  return `
    <div class="space-y-6">
      <div class="stat-block rounded-lg p-4">
        <h3 class="text-lg font-semibold text-green-400 mb-3">Section Title</h3>
        <!-- Content here -->
      </div>
    </div>
  `;
}
```

### Error Handling
- File upload validation
- Character data validation
- Graceful degradation for missing data
- User feedback for all operations

## Performance Considerations

### Memory Management
- Efficient token storage
- PDF URL cleanup
- Modal content lazy loading
- Character sheet data optimization

### Rendering Optimization
- Canvas redraw optimization
- Modal visibility management
- Tab content generation on demand
- Responsive image handling

## Testing Strategy

### Manual Testing
- Character sheet display across different builds
- File upload with various formats
- Modal interactions and edge cases
- Responsive behavior on different devices

### Browser Compatibility
- Modern browser support (ES6+)
- Canvas API compatibility
- File API support
- CSS Grid/Flexbox support

## Future Enhancements

### Short Term
- Complete all tab implementations
- PDF viewer integration
- Enhanced file parsing
- Character sheet editing

### Long Term
- Real-time collaboration
- Cloud storage integration
- Advanced character builder
- Campaign management tools

## Technical Notes

### Dependencies
- No external JavaScript frameworks
- Pure CSS with utility classes
- Canvas API for map rendering
- File API for uploads

### Browser Requirements
- Modern browser with ES6 support
- Canvas 2D context support
- File API and drag/drop support
- CSS Grid and Flexbox support

### Compatibility
- Responsive design for tablets and mobile
- Keyboard navigation support
- Screen reader accessibility considerations
- Cross-browser CSS compatibility

---

This documentation should be updated as features are added or modified. The character sheet system is designed to be extensible and maintainable while providing a rich D&D Beyond-like experience for BattleMap users.