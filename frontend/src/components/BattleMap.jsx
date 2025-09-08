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
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showSubmapManager, setShowSubmapManager] = useState(false);
  
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

  // Auto-open character sheet when token is selected
  useEffect(() => {
    if (selectedToken && !showCharacterSheet) {
      setShowCharacterSheet(true);
    }
  }, [selectedToken, showCharacterSheet]);

  return (
    <TooltipProvider>
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
              { id: 'move', icon: Move, label: 'Pan & Move' },
              { id: 'ruler', icon: Ruler, label: 'Ruler Tool' },
              { id: 'fog', icon: Eye, label: 'Fog Brush' },
              { id: 'token', icon: Users, label: 'Add Token' }
            ].map(tool => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === tool.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className={selectedTool === tool.id ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  <Switch
                    checked={gridEnabled}
                    onCheckedChange={setGridEnabled}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Grid</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Grid:</span>
              <Slider
                value={[gridSize]}
                onValueChange={(value) => setGridSize(value[0])}
                max={200}
                min={10}
                step={5}
                className="w-20"
              />
              <span className="text-xs text-gray-400">{gridSize}px</span>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  {fogEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <Switch
                    checked={fogEnabled}
                    onCheckedChange={setFogEnabled}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fog of War</p>
              </TooltipContent>
            </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Load Map
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Background Map</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={saveScenario}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Scenario</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={newScenario}>
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Scenario</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex relative">
          {/* Left Panels */}
          <div className="flex">
            {/* Token Panel */}
            {showTokenPanel && (
              <div className="w-80 h-full">
                <TokenPanel onClose={() => setShowTokenPanel(false)} />
              </div>
            )}

            {/* Character Sheet */}
            {showCharacterSheet && selectedToken && (
              <div className="w-96 h-full">
                <CharacterSheet
                  token={selectedToken}
                  onClose={() => setShowCharacterSheet(false)}
                />
              </div>
            )}

            {/* Chat/Dice/Initiative Combined Panel */}
            {showChatPanel && (
              <div className="w-96 h-full">
                <ChatDiceInitiative onClose={() => setShowChatPanel(false)} />
              </div>
            )}

            {/* Submap Manager */}
            {showSubmapManager && (
              <div className="w-80 h-full">
                <SubmapManager onClose={() => setShowSubmapManager(false)} />
              </div>
            )}
          </div>

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

          {/* Side Panel Controls */}
          <div className="bg-gray-800 border-l border-gray-700 flex flex-col">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showTokenPanel ? 'default' : 'ghost'}
                  className="p-3 rounded-none border-b border-gray-700"
                  onClick={() => {
                    setShowTokenPanel(!showTokenPanel);
                    if (showCharacterSheet) setShowCharacterSheet(false);
                    if (showChatPanel) setShowChatPanel(false);
                    if (showSubmapManager) setShowSubmapManager(false);
                  }}
                >
                  <Users className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Token Manager</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showCharacterSheet ? 'default' : 'ghost'}
                  className="p-3 rounded-none border-b border-gray-700"
                  onClick={() => {
                    if (selectedToken) {
                      setShowCharacterSheet(!showCharacterSheet);
                      if (showTokenPanel) setShowTokenPanel(false);
                      if (showChatPanel) setShowChatPanel(false);
                      if (showSubmapManager) setShowSubmapManager(false);
                    }
                  }}
                  disabled={!selectedToken}
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{selectedToken ? 'Character Sheet' : 'Select a token first'}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showChatPanel ? 'default' : 'ghost'}
                  className="p-3 rounded-none border-b border-gray-700"
                  onClick={() => {
                    setShowChatPanel(!showChatPanel);
                    if (showTokenPanel) setShowTokenPanel(false);
                    if (showCharacterSheet) setShowCharacterSheet(false);
                    if (showSubmapManager) setShowSubmapManager(false);
                  }}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Chat, Dice & Initiative</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showSubmapManager ? 'default' : 'ghost'}
                  className="p-3 rounded-none border-b border-gray-700"
                  onClick={() => {
                    setShowSubmapManager(!showSubmapManager);
                    if (showTokenPanel) setShowTokenPanel(false);
                    if (showCharacterSheet) setShowCharacterSheet(false);
                    if (showChatPanel) setShowChatPanel(false);
                  }}
                >
                  <Map className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Submap Manager</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
};

export default BattleMap;