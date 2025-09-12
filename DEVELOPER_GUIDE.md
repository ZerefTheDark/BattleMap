# BattleMap Developer Guide: Enhanced D&D 5e Character Sheet System

## Overview

This guide details the implementation of comprehensive D&D 5e character sheets and campaign import functionality in BattleMap. The system provides a detailed digital character sheet experience with enhanced functionality, integrated seamlessly into the battle map application.

## Recent Enhancements

### Drag and Drop Position Issue Analysis

**Issue**: Module drag and drop functionality causes windows to follow movements correctly but may not land in the exact intended position, resulting in visual misalignment.

**Root Cause**: Coordinate system mismatch between position capture and position setting:
1. Initial position captured using `getBoundingClientRect()` (viewport-relative coordinates)
2. Mouse movement deltas calculated in screen coordinates 
3. Final position applied using `style.left/top` (absolute positioning)
4. Any discrepancy (scroll offset, transform scaling, viewport changes) causes misalignment
5. Viewport bounds clamping can introduce additional position drift

**Location**: Lines 3320-3450 in index.html

### Character Sheet Enhancement

The character sheet system has been significantly enhanced to include comprehensive D&D 5e character details across all tabs.

## Architecture

### Core Components

1. **Application State Management** (`appState`)
2. **Enhanced Modal System** (Upload, Character Sheet, PDF Viewer)
3. **Token System** (Enhanced with comprehensive character data)
4. **File Upload System** (Campaign files and PDFs)
5. **Enhanced Character Sheet Data Structure**

## Enhanced Character Sheet Data Structure

### Comprehensive Character Object
```javascript
{
  id: Number,           // Unique token identifier
  name: String,         // Character display name
  type: 'player' | 'enemy',
  characterSheet: {
    // Basic Information
    name: String,
    level: Number,
    class: String,
    race: String,
    background: String,
    alignment: String,
    experiencePoints: Number,
    
    // Ability Scores
    stats: {
      str: Number,      // Strength (8-20)
      dex: Number,      // Dexterity
      con: Number,      // Constitution
      int: Number,      // Intelligence
      wis: Number,      // Wisdom
      cha: Number       // Charisma
    },
    
    // Health and Vitality
    health: {
      current: Number,  // Current HP
      max: Number,      // Maximum HP
      temp: Number      // Temporary HP
    },
    hitDice: {
      total: Number,
      used: Number,
      type: String      // e.g., 'd8', 'd10'
    },
    deathSaves: {
      successes: Number, // 0-3
      failures: Number   // 0-3
    },
    
    // Combat Statistics
    ac: Number,           // Armor Class
    speed: Number,        // Base walking speed
    initiative: Number,   // Initiative modifier
    proficiencyBonus: Number,
    inspiration: Boolean,
    
    // Enhanced Movement
    speeds: {
      walk: Number,
      climb: Number,
      swim: Number,
      fly: Number,
      burrow: Number
    },
    
    // Senses
    senses: {
      darkvision: Number,
      blindsight: Number,
      tremorsense: Number,
      truesight: Number,
      passivePerception: Number
    },
    
    // Proficiencies
    proficiencies: {
      languages: Array,   // Known languages
      tools: Array,       // Tool proficiencies
      weapons: Array,     // Weapon proficiencies
      armor: Array        // Armor proficiencies
    },
    
    // Resistances and Immunities
    resistances: {
      damageResistances: Array,
      damageImmunities: Array,
      damageVulnerabilities: Array,
      conditionImmunities: Array
    },
    
    // Character Appearance
    appearance: {
      age: Number,
      height: String,
      weight: String,
      eyes: String,
      skin: String,
      hair: String
    },
    
    // Personality Traits
    personality: {
      traits: Array,
      ideals: Array,
      bonds: Array,
      flaws: Array
    },
    
    // Organizations and Background
    organizations: {
      faction: String,
      rank: String,
      renown: Number
    },
    
    // Spellcasting
    spellcasting: {
      class: String,
      ability: String,
      saveDC: Number,
      attackBonus: Number,
      spellSlots: {
        1: { max: Number, used: Number },
        // ... up to level 9
      }
    
    // Enhanced Data Collections
    spells: Array,           // Spell objects with comprehensive details
    inventory: Array,        // Item objects with properties
    features: Array,         // Class features and abilities
    actions: Array,          // Combat actions and special abilities
    racialTraits: Array,     // Racial traits and abilities
    feats: Array,            // Character feats
    
    // Additional Character Collections
    companions: Array,       // Animal companions, familiars
    wildShapeForms: Array,   // Druid wild shape options
    magicalItems: Array,     // Magic items and artifacts
    customAbilities: Array,  // Homebrew or custom abilities
    vehicles: Array,         // Owned vehicles and mounts
    additionalResources: Array, // Custom resource tracking
    
    // Currency
    currency: {
      pp: Number, gp: Number, ep: Number, sp: Number, cp: Number
    },
    
    // Carrying Capacity
    carryingCapacity: {
      current: Number,
      max: Number,         // Str score * 15
      encumbered: Number   // Str score * 5
    },
    
    // Saving Throws (proficiency flags)
    savingThrows: {
      str: Boolean, dex: Boolean, con: Boolean,
      int: Boolean, wis: Boolean, cha: Boolean
    },
    
    // Skills with proficiency levels (0=none, 1=proficient, 2=expertise)
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
    
    // Session Data
    notes: String,           // Session notes
    backstory: String,       // Character backstory
    allies: String,          // Allies and organizations
    enemies: String,         // Enemies and rivals
    treasures: String,       // Important treasures/items
    characterReminders: String // Character-specific reminders
  },
  
  // Enemy-specific
  pdfUrl: String | null      // PDF reference for enemies
}
```

## Enhanced Character Sheet Tabs

### 1. Overview Tab (Enhanced)
**Purpose**: Comprehensive character information and core stats

**Layout**: 3-column grid on extra-large screens, 2-column on large, single column on mobile

**Enhanced Sections**:
- **Health & Vitality**: Current/Max/Temp HP, Hit Dice, Inspiration, Death Saves
- **Ability Scores**: All six abilities with scores and modifiers
- **Combat**: AC, Initiative, Proficiency Bonus
- **Movement & Senses**: Walking speed, special movement, darkvision, passive perception
- **Character Info**: Race, Class, Level, Background, Alignment, Experience
- **Appearance**: Age, height, weight, physical features
- **Proficiencies**: Languages, tools, weapons, armor
- **Resistances & Immunities**: Damage and condition resistances/immunities

### 2. Actions Tab (Enhanced)
**Purpose**: All combat actions and abilities

**Enhanced Sections**:
- **Character Actions**: Custom character-specific actions with damage/range
- **Standard Actions**: Complete D&D 5e action list with descriptions
- **Bonus Actions**: Off-hand attacks, two-weapon fighting
- **Reactions**: Opportunity attacks and other reactive abilities

### 3. Spells Tab (Enhanced)
**Purpose**: Complete spellcasting system

**Enhanced Features**:
- **Spellcasting Info**: Class, ability, save DC, attack bonus
- **Spell Slots**: Visual tracking for all spell levels 1-9
- **Known Spells**: Comprehensive spell list with details, components, duration

### 4. Inventory Tab (Enhanced)
**Purpose**: Complete equipment and item management

**Enhanced Sections**:
- **Equipment & Inventory**: Items with descriptions, properties, rarity
- **Currency**: All five D&D currency types (pp, gp, ep, sp, cp)
- **Carrying Capacity**: Current weight, max capacity, encumbrance limits

### 5. Features Tab (Enhanced)
**Purpose**: Character abilities and proficiencies

**Enhanced Sections**:
- **Class Features**: All class abilities with usage tracking
- **Racial Traits**: Race-specific abilities and traits
- **Feats**: Character feats with prerequisites
- **Saving Throws**: Visual display with proficiency indicators
- **Skills**: All 18 skills with ability associations and expertise tracking

### 6. Description Tab (Enhanced)
**Purpose**: Character roleplay and background information

**Enhanced Sections**:
- **Character Description**: Backstory with proper formatting
- **Personality**: Traits, ideals, bonds, flaws organized in grid
- **Relationships**: Allies, enemies, and important connections
- **Organizations**: Faction membership, rank, renown
- **Treasures**: Important items and achievements

### 7. Notes Tab (Enhanced)
**Purpose**: Session management and quick reference

**Enhanced Features**:
- **Session Notes**: Large text area for campaign notes
- **Quick Reference**: Combat actions and conditions summary
- **Character Reminders**: Character-specific notes and abilities

### 8. Extras Tab (Enhanced)
**Purpose**: Advanced features and special abilities

**Enhanced Sections**:
- **Companions & Pets**: Animal companions with stats
- **Wild Shape Forms**: Druid transformation options
- **Magical Items**: Magic items with charges and properties
- **Custom Abilities**: Homebrew or special abilities
- **Vehicles & Mounts**: Transportation with stats
- **Additional Resources**: Custom resource tracking

## Module Drag and Drop Issue

### Problem Analysis
Located in lines 3320-3450, the module dragging system has a documented position misalignment issue.

### Root Cause
Coordinate system mismatch between:
1. Position capture via `getBoundingClientRect()` (viewport-relative)
2. Position setting via `style.left/top` (absolute positioning)
3. Mouse delta calculations (screen coordinates)

### Documentation Added
Comprehensive inline comments explaining:
- The exact mechanism of the issue
- Why dragging follows correctly but landing position misaligns
- Potential solutions for future maintainers
- Critical points where misalignment occurs
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