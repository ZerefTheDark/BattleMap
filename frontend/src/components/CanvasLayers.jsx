import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useBattleMapStore } from '../store/battleMapStore';

const CanvasLayers = forwardRef(({ selectedTool, onTokenSelect }, ref) => {
  const backgroundCanvasRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const tokensCanvasRef = useRef(null);
  const toolsCanvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const {
    camera,
    gridSize,
    gridEnabled,
    backgroundImage,
    fogEnabled,
    fogReveals,
    ruler,
    tokens,
    selectedTokenId,
    setCamera,
    setRuler,
    addFogReveal,
    addToken,
    updateToken
  } = useBattleMapStore();

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const DPR = window.devicePixelRatio || 1;

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  // Setup canvas dimensions and scaling
  const setupCanvas = useCallback((canvas) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);
    return ctx;
  }, [DPR]);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX, screenY) => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const screenCenterX = rect.width / 2;
    const screenCenterY = rect.height / 2;
    
    const worldX = (screenX - screenCenterX) / camera.scale + camera.x;
    const worldY = (screenY - screenCenterY) / camera.scale + camera.y;
    
    return { x: worldX, y: worldY };
  }, [camera]);

  // Convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldX, worldY) => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const screenCenterX = rect.width / 2;
    const screenCenterY = rect.height / 2;
    
    const screenX = (worldX - camera.x) * camera.scale + screenCenterX;
    const screenY = (worldY - camera.y) * camera.scale + screenCenterY;
    
    return { x: screenX, y: screenY };
  }, [camera]);

  // Apply camera transform to context
  const applyTransform = useCallback((ctx) => {
    const canvas = ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(centerX, centerY);
    ctx.scale(camera.scale, camera.scale);
    ctx.translate(-camera.x, -camera.y);
  }, [camera]);

  // Draw background
  const drawBackground = useCallback(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas);
    
    // Clear entire canvas first
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    
    // Fill with dark background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    
    if (backgroundImage) {
      ctx.save();
      applyTransform(ctx);
      
      const img = new Image();
      img.onload = () => {
        // Clear and redraw to ensure image appears
        ctx.clearRect(-10000, -10000, 20000, 20000);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(-10000, -10000, 20000, 20000);
        
        const imgWidth = backgroundImage.width;
        const imgHeight = backgroundImage.height;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      };
      img.src = backgroundImage.dataUrl;
      ctx.restore();
    }
  }, [backgroundImage, setupCanvas, applyTransform, DPR]);

  // Draw grid
  const drawGrid = useCallback(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas || !gridEnabled) {
      if (canvas) {
        const ctx = setupCanvas(canvas);
        ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
      }
      return;
    }
    
    const ctx = setupCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    
    ctx.save();
    applyTransform(ctx);
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = Math.max(0.5, 1 / camera.scale);
    ctx.globalAlpha = 0.6;
    
    // Calculate visible area bounds
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const worldLeft = (0 - centerX) / camera.scale + camera.x;
    const worldRight = (rect.width - centerX) / camera.scale + camera.x;
    const worldTop = (0 - centerY) / camera.scale + camera.y;
    const worldBottom = (rect.height - centerY) / camera.scale + camera.y;
    
    // Draw only visible grid lines
    const startX = Math.floor(worldLeft / gridSize) * gridSize;
    const endX = Math.ceil(worldRight / gridSize) * gridSize;
    const startY = Math.floor(worldTop / gridSize) * gridSize;
    const endY = Math.ceil(worldBottom / gridSize) * gridSize;
    
    ctx.beginPath();
    
    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    
    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    
    ctx.stroke();
    ctx.restore();
  }, [gridEnabled, gridSize, camera, setupCanvas, applyTransform, DPR]);

  // Draw tokens
  const drawTokens = useCallback(() => {
    const canvas = tokensCanvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    
    applyTransform(ctx);
    
    tokens.forEach(token => {
      ctx.save();
      
      // Draw token circle/square
      ctx.fillStyle = token.color || '#3b82f6';
      ctx.strokeStyle = token.id === selectedTokenId ? '#fbbf24' : '#1f2937';
      ctx.lineWidth = 3 / camera.scale;
      
      if (token.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(token.x, token.y, token.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(
          token.x - token.size / 2,
          token.y - token.size / 2,
          token.size,
          token.size
        );
        ctx.strokeRect(
          token.x - token.size / 2,
          token.y - token.size / 2,
          token.size,
          token.size
        );
      }
      
      // Draw token name
      if (token.name) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 / camera.scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(token.name, token.x, token.y + token.size / 2 + 16 / camera.scale);
      }
      
      ctx.restore();
    });
  }, [tokens, selectedTokenId, camera.scale, setupCanvas, applyTransform]);

  // Draw tools (ruler, fog)
  const drawTools = useCallback(() => {
    const canvas = toolsCanvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    
    applyTransform(ctx);
    
    // Draw fog of war
    if (fogEnabled) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(-4000, -4000, 8000, 8000);
      
      ctx.globalCompositeOperation = 'destination-out';
      fogReveals.forEach(reveal => {
        ctx.beginPath();
        ctx.arc(reveal.x, reveal.y, reveal.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
    
    // Draw ruler
    if (ruler.active && ruler.start && ruler.end) {
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2 / camera.scale;
      ctx.setLineDash([10 / camera.scale, 5 / camera.scale]);
      
      ctx.beginPath();
      ctx.moveTo(ruler.start.x, ruler.start.y);
      ctx.lineTo(ruler.end.x, ruler.end.y);
      ctx.stroke();
      
      // Draw distance
      const dx = ruler.end.x - ruler.start.x;
      const dy = ruler.end.y - ruler.start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const squares = Math.round(distance / gridSize);
      
      ctx.fillStyle = '#ef4444';
      ctx.font = `${14 / camera.scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `${squares} sq (${Math.round(distance)}px)`,
        (ruler.start.x + ruler.end.x) / 2,
        (ruler.start.y + ruler.end.y) / 2 - 10 / camera.scale
      );
      
      ctx.restore();
    }
  }, [fogEnabled, fogReveals, ruler, gridSize, camera.scale, setupCanvas, applyTransform]);

  // Find token at position
  const findTokenAt = useCallback((worldX, worldY) => {
    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];
      const dx = worldX - token.x;
      const dy = worldY - token.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= token.size / 2) {
        return token;
      }
    }
    return null;
  }, [tokens]);

  // Handle pointer events
  const handlePointerDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);
    
    isDragging.current = true;
    lastPointer.current = { x: screenX, y: screenY };
    
    switch (selectedTool) {
      case 'move':
        // Check if clicking on a token first
        const clickedToken = findTokenAt(worldPos.x, worldPos.y);
        if (clickedToken) {
          onTokenSelect(clickedToken.id);
        }
        break;
        
      case 'ruler':
        setRuler({
          active: true,
          start: worldPos,
          end: worldPos
        });
        break;
        
      case 'fog':
        if (fogEnabled) {
          addFogReveal({
            x: worldPos.x,
            y: worldPos.y,
            radius: 50
          });
        }
        break;
        
      case 'token':
        const newToken = {
          name: `Token ${tokens.length + 1}`,
          x: worldPos.x,
          y: worldPos.y,
          size: gridSize,
          shape: 'circle',
          color: '#3b82f6'
        };
        addToken(newToken);
        break;
    }
  }, [selectedTool, screenToWorld, findTokenAt, onTokenSelect, setRuler, fogEnabled, addFogReveal, tokens.length, gridSize, addToken]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);
    
    switch (selectedTool) {
      case 'move':
        const dx = screenX - lastPointer.current.x;
        const dy = screenY - lastPointer.current.y;
        
        if (selectedTokenId) {
          // Move selected token
          const selectedToken = tokens.find(t => t.id === selectedTokenId);
          if (selectedToken) {
            updateToken(selectedTokenId, {
              x: selectedToken.x + dx / camera.scale,
              y: selectedToken.y + dy / camera.scale
            });
          }
        } else {
          // Pan camera
          setCamera({
            ...camera,
            x: camera.x - dx / camera.scale,
            y: camera.y - dy / camera.scale
          });
        }
        break;
        
      case 'ruler':
        setRuler(prev => ({
          ...prev,
          end: worldPos
        }));
        break;
        
      case 'fog':
        if (fogEnabled) {
          addFogReveal({
            x: worldPos.x,
            y: worldPos.y,
            radius: 50
          });
        }
        break;
    }
    
    lastPointer.current = { x: screenX, y: screenY };
  }, [selectedTool, screenToWorld, selectedTokenId, tokens, updateToken, camera, setCamera, setRuler, fogEnabled, addFogReveal]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    
    if (selectedTool === 'ruler') {
      setRuler(prev => ({ ...prev, active: false }));
    }
  }, [selectedTool, setRuler]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, camera.scale * scaleFactor));
    
    // Adjust camera position to zoom toward cursor
    const scaleRatio = newScale / camera.scale;
    setCamera({
      x: worldPos.x - (worldPos.x - camera.x) * scaleRatio,
      y: worldPos.y - (worldPos.y - camera.y) * scaleRatio,
      scale: newScale
    });
  }, [camera, screenToWorld, setCamera]);

  // Handle resize and initial setup
  useEffect(() => {
    const handleResize = () => {
      // Force canvas resize before redrawing
      if (backgroundCanvasRef.current) setupCanvas(backgroundCanvasRef.current);
      if (gridCanvasRef.current) setupCanvas(gridCanvasRef.current);
      if (tokensCanvasRef.current) setupCanvas(tokensCanvasRef.current);
      if (toolsCanvasRef.current) setupCanvas(toolsCanvasRef.current);
      
      // Small delay to ensure canvas is resized
      setTimeout(() => {
        drawBackground();
        drawGrid();
        drawTokens();
        drawTools();
      }, 10);
    };
    
    // Initial setup
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas, drawBackground, drawGrid, drawTokens, drawTools]);

  // Redraw on state changes
  useEffect(() => {
    drawBackground();
  }, [drawBackground]);
  
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);
  
  useEffect(() => {
    drawTokens();
  }, [drawTokens]);
  
  useEffect(() => {
    drawTools();
  }, [drawTools]);

  // Ensure canvases are properly sized on mount
  useEffect(() => {
    const initializeCanvases = () => {
      const canvases = [
        backgroundCanvasRef.current,
        gridCanvasRef.current,
        tokensCanvasRef.current,
        toolsCanvasRef.current
      ];
      
      canvases.forEach(canvas => {
        if (canvas) {
          // Force proper sizing
          const container = canvas.parentElement;
          if (container) {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * DPR;
            canvas.height = rect.height * DPR;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            const ctx = canvas.getContext('2d');
            ctx.scale(DPR, DPR);
          }
        }
      });
      
      // Redraw after sizing
      setTimeout(() => {
        drawBackground();
        drawGrid();
        drawTokens();
        drawTools();
      }, 50);
    };

    // Initialize with a delay to ensure DOM is ready
    const timer = setTimeout(initializeCanvases, 100);
    
    return () => clearTimeout(timer);
  }, [DPR, drawBackground, drawGrid, drawTokens, drawTools]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={backgroundCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={gridCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />
      <canvas
        ref={tokensCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      />
      <canvas
        ref={toolsCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 4 }}
      />
    </div>
  );
});

CanvasLayers.displayName = 'CanvasLayers';

export default CanvasLayers;