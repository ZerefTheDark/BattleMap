import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Move, 
  Ruler, 
  Eye, 
  EyeOff, 
  Grid3X3, 
  Plus, 
  Save, 
  Upload,
  Users,
  MessageSquare,
  Dice6,
  Map,
  Settings,
  FileText
} from 'lucide-react';
import CanvasLayers from './CanvasLayers';
import TokenPanel from './TokenPanel';
import CharacterSheet from './CharacterSheet';
import ChatDiceInitiative from './ChatDiceInitiative';
import SubmapManager from './SubmapManager';
import { useBattleMapStore } from '../store/battleMapStore';

const BattleMap = () => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('move');
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInitiative, setShowInitiative] = useState(false);
  const [showSubmapModal, setShowSubmapModal] = useState(false);
  
  const {
    camera,
    gridSize,
    gridEnabled,
    fogEnabled,
    tokens,
    selectedTokenId,
    submaps,
    setCamera,
    setGridSize,
    setGridEnabled,
    setFogEnabled,
    selectToken,
    loadBackgroundImage,
    saveScenario,
    loadScenario,
    newScenario
  } = useBattleMapStore();

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        loadBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [loadBackgroundImage]);

  const selectedToken = tokens.find(token => token.id === selectedTokenId);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-blue-400">Battle Map</h1>
          <Badge variant="outline" className="text-xs">
            {Math.round(camera.scale * 100)}%
          </Badge>
        </div>
        
        {/* Tool Selection */}
        <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
          {[
            { id: 'move', icon: Move, label: 'Pan' },
            { id: 'ruler', icon: Ruler, label: 'Ruler' },
            { id: 'fog', icon: Eye, label: 'Fog Brush' },
            { id: 'token', icon: Users, label: 'Add Token' }
          ].map(tool => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTool(tool.id)}
              className={selectedTool === tool.id ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            <Switch
              checked={gridEnabled}
              onCheckedChange={setGridEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Grid:</span>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => setGridSize(value[0])}
              max={100}
              min={20}
              step={10}
              className="w-20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {fogEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <Switch
              checked={fogEnabled}
              onCheckedChange={setFogEnabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>

        {/* File Operations */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload').click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            Load Map
          </Button>
          
          <Button variant="outline" size="sm" onClick={saveScenario}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" onClick={newScenario}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
          <CanvasLayers
            ref={canvasRef}
            selectedTool={selectedTool}
            onTokenSelect={selectToken}
          />
          
          {/* Scale Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-gray-800/80 text-white">
              Scale: {Math.round(camera.scale * 100)}%
            </Badge>
          </div>
        </div>

        {/* Side Panels */}
        <div className="flex">
          {/* Tool Panels */}
          <div className="bg-gray-800 border-l border-gray-700 flex flex-col">
            <Button
              variant={showTokenPanel ? 'default' : 'ghost'}
              className="p-3 rounded-none border-b border-gray-700"
              onClick={() => setShowTokenPanel(!showTokenPanel)}
            >
              <Users className="w-5 h-5" />
            </Button>
            
            <Button
              variant={showDiceRoller ? 'default' : 'ghost'}
              className="p-3 rounded-none border-b border-gray-700"
              onClick={() => setShowDiceRoller(!showDiceRoller)}
            >
              <Dice6 className="w-5 h-5" />
            </Button>
            
            <Button
              variant={showChat ? 'default' : 'ghost'}
              className="p-3 rounded-none border-b border-gray-700"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            <Button
              variant={showInitiative ? 'default' : 'ghost'}
              className="p-3 rounded-none border-b border-gray-700"
              onClick={() => setShowInitiative(!showInitiative)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              className="p-3 rounded-none border-b border-gray-700"
              onClick={() => setShowSubmapModal(true)}
            >
              <Map className="w-5 h-5" />
            </Button>
          </div>

          {/* Token Panel */}
          {showTokenPanel && (
            <TokenPanel onClose={() => setShowTokenPanel(false)} />
          )}

          {/* Character Sheet */}
          {showCharacterSheet && selectedToken && (
            <CharacterSheet
              token={selectedToken}
              onClose={() => setShowCharacterSheet(false)}
            />
          )}
        </div>

        {/* Bottom Panels */}
        {showDiceRoller && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <DiceRoller onClose={() => setShowDiceRoller(false)} />
          </div>
        )}

        {showChat && (
          <div className="absolute bottom-0 right-0 w-80 h-96 z-10">
            <ChatPanel onClose={() => setShowChat(false)} />
          </div>
        )}

        {showInitiative && (
          <div className="absolute top-16 right-4 z-10">
            <InitiativeTracker onClose={() => setShowInitiative(false)} />
          </div>
        )}
      </div>

      {/* Submap Modal */}
      {showSubmapModal && (
        <SubmapModal onClose={() => setShowSubmapModal(false)} />
      )}
    </div>
  );
};

export default BattleMap;