#!/usr/bin/env node

/**
 * Model Context Protocol (MCP) Server for BattleMap
 * 
 * This server provides tools for:
 * - Battle map manipulation
 * - Token management
 * - Character sheet operations
 * - Dice rolling
 * - Campaign file handling
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class BattleMapMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'battlemap-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_token',
            description: 'Create a new token on the battle map',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Token name' },
                x: { type: 'number', description: 'X coordinate' },
                y: { type: 'number', description: 'Y coordinate' },
                color: { type: 'string', description: 'Token color (hex)' },
                size: { type: 'number', description: 'Token size in pixels' },
                type: { 
                  type: 'string', 
                  enum: ['player', 'enemy', 'npc', 'object'],
                  description: 'Token type' 
                }
              },
              required: ['name', 'x', 'y']
            }
          },
          {
            name: 'roll_dice',
            description: 'Roll dice with specified formula',
            inputSchema: {
              type: 'object',
              properties: {
                formula: { 
                  type: 'string', 
                  description: 'Dice formula (e.g., "1d20+5", "2d6")',
                  pattern: '^\\d+d\\d+(\\+\\d+)?$'
                }
              },
              required: ['formula']
            }
          },
          {
            name: 'add_party_member',
            description: 'Add a character to the party',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Character name' },
                class: { type: 'string', description: 'Character class' },
                level: { type: 'number', description: 'Character level' },
                hp: { type: 'number', description: 'Current HP' },
                maxHp: { type: 'number', description: 'Maximum HP' }
              },
              required: ['name', 'class', 'level']
            }
          },
          {
            name: 'manage_fog_of_war',
            description: 'Manage fog of war on the battle map',
            inputSchema: {
              type: 'object',
              properties: {
                mode: { 
                  type: 'string', 
                  enum: ['brush', 'cone', 'circle', 'clear'],
                  description: 'Fog of war mode' 
                },
                x: { type: 'number', description: 'X coordinate' },
                y: { type: 'number', description: 'Y coordinate' },
                size: { type: 'number', description: 'Effect size' }
              },
              required: ['mode', 'x', 'y']
            }
          },
          {
            name: 'upload_campaign_file',
            description: 'Process uploaded campaign files',
            inputSchema: {
              type: 'object',
              properties: {
                filename: { type: 'string', description: 'File name' },
                fileType: { 
                  type: 'string', 
                  enum: ['json', 'xml', 'zip', 'pdf'],
                  description: 'File type' 
                },
                content: { type: 'string', description: 'Base64 encoded file content' }
              },
              required: ['filename', 'fileType', 'content']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_token':
            return await this.createToken(args);
          case 'roll_dice':
            return await this.rollDice(args);
          case 'add_party_member':
            return await this.addPartyMember(args);
          case 'manage_fog_of_war':
            return await this.manageFogOfWar(args);
          case 'upload_campaign_file':
            return await this.uploadCampaignFile(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error.message}`
        );
      }
    });
  }

  async createToken(args) {
    const { name, x, y, color = '#ef4444', size = 20, type = 'player' } = args;
    
    // Simulate token creation
    const tokenId = Date.now();
    
    return {
      content: [
        {
          type: 'text',
          text: `Created token "${name}" at (${x}, ${y}) with ID ${tokenId}`
        }
      ]
    };
  }

  async rollDice(args) {
    const { formula } = args;
    
    // Parse dice formula (e.g., "1d20+5")
    const match = formula.match(/(\d+)d(\d+)(\+\d+)?/);
    if (!match) {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid dice formula');
    }

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    const rolls = [];
    let total = modifier;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Rolling ${formula}: [${rolls.join(', ')}]${modifier ? ` + ${modifier}` : ''} = ${total}`
        }
      ]
    };
  }

  async addPartyMember(args) {
    const { name, class: charClass, level, hp = 10, maxHp = 10 } = args;
    
    return {
      content: [
        {
          type: 'text',
          text: `Added ${name} (Level ${level} ${charClass}) to party with ${hp}/${maxHp} HP`
        }
      ]
    };
  }

  async manageFogOfWar(args) {
    const { mode, x, y, size = 50 } = args;
    
    return {
      content: [
        {
          type: 'text',
          text: `Applied ${mode} fog of war at (${x}, ${y}) with size ${size}`
        }
      ]
    };
  }

  async uploadCampaignFile(args) {
    const { filename, fileType, content } = args;
    
    // Simulate file processing
    return {
      content: [
        {
          type: 'text',
          text: `Processed campaign file: ${filename} (${fileType})`
        }
      ]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('BattleMap MCP Server started');
  }
}

// Start the server
const server = new BattleMapMCPServer();
server.start().catch(console.error);