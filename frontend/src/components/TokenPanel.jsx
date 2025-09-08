import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { X, Plus, Trash2, Edit } from 'lucide-react';
import { useBattleMapStore } from '../store/battleMapStore';

const TokenPanel = ({ onClose }) => {
  const { tokens, addToken, removeToken, updateToken, selectToken, selectedTokenId } = useBattleMapStore();
  const [showTokenCreator, setShowTokenCreator] = useState(false);
  const [newToken, setNewToken] = useState({
    name: '',
    shape: 'circle',
    size: 25,
    color: '#3b82f6'
  });

  const handleCreateToken = () => {
    if (newToken.name.trim()) {
      const tokenToAdd = {
        ...newToken,
        x: 0,
        y: 0,
        hp: { current: 100, max: 100 },
        conditions: []
      };
      
      addToken(tokenToAdd);
      
      // Save to custom tokens storage
      const customTokens = JSON.parse(localStorage.getItem('custom_tokens') || '[]');
      const customToken = {
        id: Date.now().toString(),
        name: newToken.name,
        shape: newToken.shape,
        size: newToken.size,
        color: newToken.color,
        created: Date.now()
      };
      customTokens.push(customToken);
      localStorage.setItem('custom_tokens', JSON.stringify(customTokens));
      
      setNewToken({
        name: '',
        shape: 'circle',
        size: 25,
        color: '#3b82f6'
      });
      setShowTokenCreator(false);
    }
  };

  const tokenColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Yellow', value: '#eab308' }
  ];

  return (
    <Card className="w-80 bg-gray-800 border-gray-700 text-white h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Tokens</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={() => setShowTokenCreator(!showTokenCreator)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Token
        </Button>

        {showTokenCreator && (
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor="token-name">Name</Label>
                <Input
                  id="token-name"
                  value={newToken.name}
                  onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                  placeholder="Token name"
                  className="bg-gray-600 border-gray-500"
                />
              </div>
              
              <div>
                <Label>Shape</Label>
                <Select value={newToken.shape} onValueChange={(value) => setNewToken({ ...newToken, shape: value })}>
                  <SelectTrigger className="bg-gray-600 border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Size: {newToken.size}px</Label>
                <Slider
                  value={[newToken.size]}
                  onValueChange={(value) => setNewToken({ ...newToken, size: value[0] })}
                  max={75}
                  min={10}
                  step={2}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Tiny</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
              
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {tokenColors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newToken.color === color.value ? 'border-white' : 'border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewToken({ ...newToken, color: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateToken} className="flex-1 bg-green-600 hover:bg-green-700">
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTokenCreator(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Custom Tokens */}
        <div className="border-t border-gray-700 pt-3">
          <h3 className="text-sm font-semibold text-green-400 mb-2">Saved Token Templates</h3>
          <div className="grid grid-cols-2 gap-2">
            {JSON.parse(localStorage.getItem('custom_tokens') || '[]').slice(-6).map((savedToken) => (
              <Button
                key={savedToken.id}
                variant="outline"
                size="sm"
                className="h-8 text-xs border-gray-600 hover:border-green-500"
                onClick={() => {
                  addToken({
                    ...savedToken,
                    x: 0,
                    y: 0,
                    hp: { current: 100, max: 100 },
                    conditions: []
                  });
                }}
              >
                <div
                  className={`w-3 h-3 mr-1 border ${
                    savedToken.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
                  }`}
                  style={{ backgroundColor: savedToken.color }}
                />
                {savedToken.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tokens.map((token) => (
            <Card
              key={token.id}
              className={`bg-gray-700 border-gray-600 cursor-pointer transition-colors ${
                selectedTokenId === token.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => selectToken(token.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 border-2 border-gray-400 ${
                        token.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
                      }`}
                      style={{ backgroundColor: token.color }}
                    />
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-400">
                        {token.hp ? `${token.hp.current}/${token.hp.max} HP` : 'No HP set'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle character sheet
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeToken(token.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Token Size Control */}
                {selectedTokenId === token.id && (
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <Label className="text-xs">Size: {token.size}px</Label>
                    <Slider
                      value={[token.size]}
                      onValueChange={(value) => updateToken(token.id, { size: value[0] })}
                      max={150}
                      min={20}
                      step={5}
                      className="mt-1"
                    />
                  </div>
                )}
                
                {token.conditions && token.conditions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {token.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-600 text-xs rounded"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {tokens.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No tokens created yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPanel;