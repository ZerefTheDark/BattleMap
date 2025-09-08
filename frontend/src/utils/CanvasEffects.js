// Enhanced Canvas Graphics Effects for The Dragon Stones

export class CanvasEffects {
  static createGradientTexture(ctx, width, height, colors) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    return gradient;
  }

  static createRadialGlow(ctx, x, y, innerRadius, outerRadius, color) {
    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    return gradient;
  }

  static drawEnhancedToken(ctx, token, scale, isSelected = false) {
    const { x, y, size, color, shape } = token;
    
    ctx.save();
    
    // Add glow effect for selected tokens
    if (isSelected) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20 / scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    // Create gradient for token
    const gradient = this.createRadialGradient(
      ctx, x, y, 0, size / 2,
      [color, this.darkenColor(color, 30)]
    );
    
    // Draw main token shape
    ctx.fillStyle = gradient;
    ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
    ctx.lineWidth = Math.max(2, 3 / scale);
    
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    }
    
    // Add inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(x, y - size / 6, size / 3, 0, Math.PI * 2);
    } else {
      ctx.fillRect(x - size / 3, y - size / 3, size / 1.5, size / 4);
    }
    ctx.fill();
    
    // Draw name with enhanced styling
    if (token.name) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(2, 2 / scale);
      ctx.font = `bold ${Math.max(12, 14 / scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      const textY = y + size / 2 + 8 / scale;
      ctx.strokeText(token.name, x, textY);
      ctx.fillText(token.name, x, textY);
    }
    
    ctx.restore();
  }

  static drawEnhancedGrid(ctx, camera, gridSize, canvasWidth, canvasHeight) {
    ctx.save();
    
    // Calculate visible area
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const worldLeft = (-centerX) / camera.scale + camera.x;
    const worldRight = (canvasWidth - centerX) / camera.scale + camera.x;
    const worldTop = (-centerY) / camera.scale + camera.y;
    const worldBottom = (canvasHeight - centerY) / camera.scale + camera.y;
    
    // Draw major grid lines (every 5th line)
    const startX = Math.floor(worldLeft / gridSize) * gridSize;
    const endX = Math.ceil(worldRight / gridSize) * gridSize;
    const startY = Math.floor(worldTop / gridSize) * gridSize;
    const endY = Math.ceil(worldBottom / gridSize) * gridSize;
    
    // Minor grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = Math.max(0.5, 0.5 / camera.scale);
    ctx.beginPath();
    
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    
    ctx.stroke();
    
    // Major grid lines (every 5th line)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = Math.max(1, 1 / camera.scale);
    ctx.beginPath();
    
    for (let x = startX; x <= endX; x += gridSize * 5) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    
    for (let y = startY; y <= endY; y += gridSize * 5) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    
    ctx.stroke();
    
    ctx.restore();
  }

  static drawEnhancedRuler(ctx, ruler, gridSize, scale) {
    if (!ruler.active || !ruler.start || !ruler.end) return;
    
    ctx.save();
    
    const dx = ruler.end.x - ruler.start.x;
    const dy = ruler.end.y - ruler.start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const squares = Math.round(distance / gridSize);
    const feet = squares * 5; // Each square is 5 feet in D&D
    
    // Draw ruler line with glow
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10 / scale;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = Math.max(3, 3 / scale);
    ctx.setLineDash([15 / scale, 5 / scale]);
    
    ctx.beginPath();
    ctx.moveTo(ruler.start.x, ruler.start.y);
    ctx.lineTo(ruler.end.x, ruler.end.y);
    ctx.stroke();
    
    // Draw measurement points
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(ruler.start.x, ruler.start.y, 4 / scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(ruler.end.x, ruler.end.y, 4 / scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw distance label with enhanced styling
    const midX = (ruler.start.x + ruler.end.x) / 2;
    const midY = (ruler.start.y + ruler.end.y) / 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(
      midX - 40 / scale, 
      midY - 25 / scale, 
      80 / scale, 
      20 / scale
    );
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1 / scale;
    ctx.font = `bold ${Math.max(12, 14 / scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const text = `${feet} ft`;
    ctx.strokeText(text, midX, midY);
    ctx.fillText(text, midX, midY);
    
    ctx.restore();
  }

  static drawEnhancedFog(ctx, fogReveals, camera, canvasWidth, canvasHeight) {
    if (fogReveals.length === 0) return;
    
    ctx.save();
    
    // Calculate visible area
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const worldLeft = (-centerX) / camera.scale + camera.x;
    const worldRight = (canvasWidth - centerX) / camera.scale + camera.x;
    const worldTop = (-centerY) / camera.scale + camera.y;
    const worldBottom = (canvasHeight - centerY) / camera.scale + camera.y;
    
    // Draw fog overlay with gradient
    const fogGradient = ctx.createLinearGradient(
      worldLeft, worldTop, 
      worldRight, worldBottom
    );
    fogGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    fogGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
    fogGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    
    ctx.fillStyle = fogGradient;
    ctx.fillRect(
      worldLeft - 100, 
      worldTop - 100, 
      (worldRight - worldLeft) + 200, 
      (worldBottom - worldTop) + 200
    );
    
    // Cut out revealed areas with soft edges
    ctx.globalCompositeOperation = 'destination-out';
    
    fogReveals.forEach(reveal => {
      const revealGradient = ctx.createRadialGradient(
        reveal.x, reveal.y, 0,
        reveal.x, reveal.y, reveal.radius
      );
      revealGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      revealGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)');
      revealGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = revealGradient;
      ctx.beginPath();
      ctx.arc(reveal.x, reveal.y, reveal.radius * 1.2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  static createRadialGradient(ctx, x, y, innerRadius, outerRadius, colors) {
    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    return gradient;
  }

  static darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  static lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  static addParticleEffects(ctx, particles) {
    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  static drawEnhancedBackground(ctx, backgroundImage, scale) {
    if (!backgroundImage) return;
    
    ctx.save();
    
    // Add subtle texture overlay
    const img = new Image();
    img.onload = () => {
      const imgWidth = backgroundImage.width * (backgroundImage.scale || 1.2);
      const imgHeight = backgroundImage.height * (backgroundImage.scale || 1.2);
      
      // Draw main image
      ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      
      // Add enhancement overlay
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      
      ctx.globalCompositeOperation = 'source-over';
    };
    img.src = backgroundImage.dataUrl;
    
    ctx.restore();
  }
}