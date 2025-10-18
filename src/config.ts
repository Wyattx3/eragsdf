import dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';

dotenv.config();

export const config = {
  // Discord Bot
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  prefix: process.env.PREFIX || '!',
  
  // Bot Settings
  maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || '100'),
  
  // Web Dashboard
  webPort: parseInt(process.env.WEB_PORT || '3000'),
  webEnabled: process.env.WEB_ENABLED === 'true',
  
  // Audio
  audioQuality: process.env.AUDIO_QUALITY || 'high',
  defaultVolume: parseInt(process.env.DEFAULT_VOLUME || '50'),
  
  // Features
  enableFilters: process.env.ENABLE_FILTERS !== 'false',
  enableLyrics: process.env.ENABLE_LYRICS !== 'false',
  enableVoting: process.env.ENABLE_VOTING !== 'false',
  autoDisconnectTime: parseInt(process.env.AUTO_DISCONNECT_TIME || '300000'),
  
  // 24/7 Mode
  default247Mode: process.env.DEFAULT_247_MODE === 'true',
  
  // Discord Intents
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  
  // Colors - Premium Purple/Blue Gradient Theme
  colors: {
    primary: 0x6366F1,      // Indigo
    secondary: 0x8B5CF6,    // Purple  
    accent: 0x0EA5E9,       // Sky Blue
    success: 0x10B981,      // Emerald
    warning: 0xF59E0B,      // Amber
    error: 0xEF4444,        // Red
    info: 0x06B6D4,         // Cyan
    premium: 0xA855F7,      // Purple gradient
  },
  
  // Emojis
  emojis: {
    play: '▶️',
    pause: '⏸️',
    skip: '⏭️',
    stop: '⏹️',
    queue: '📜',
    volume: '🔊',
    loop: '🔁',
    shuffle: '🔀',
    music: '🎵',
    success: '✅',
    error: '❌',
    loading: '⏳',
  },
};

export function validateConfig(): boolean {
  if (!config.token) {
    console.error('❌ DISCORD_TOKEN is required in .env file');
    return false;
  }
  
  if (!config.clientId) {
    console.error('❌ CLIENT_ID is required in .env file');
    return false;
  }
  
  return true;
}

