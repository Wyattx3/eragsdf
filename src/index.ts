import { Client } from 'discord.js';
import { config, validateConfig } from './config';
import { commandHandler } from './handlers/commandHandler';
import { eventHandler } from './handlers/eventHandler';
import { startWebServer } from './web/server';
import play from 'play-dl';

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎵 DC Spider Music Bot');
  console.log('🎧 Powered by SoundCloud');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Initialize SoundCloud support with retry
  let soundCloudInitialized = false;
  const maxRetries = 3;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔧 Initializing SoundCloud support... (attempt ${i + 1}/${maxRetries})`);
      
      // Get free client ID and set it properly
      const clientID = await play.getFreeClientID();
      await play.setToken({
        soundcloud: {
          client_id: clientID
        }
      });
      
      console.log('✅ SoundCloud initialized successfully\n');
      soundCloudInitialized = true;
      break;
    } catch (error) {
      console.error(`⚠️  Attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        console.log('⏳ Retrying in 2 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  if (!soundCloudInitialized) {
    console.error('❌ Failed to initialize SoundCloud after all retries');
    console.log('⚠️  Bot will continue but music features may not work\n');
  }

  // Validate configuration
  if (!validateConfig()) {
    console.error('❌ Configuration validation failed');
    process.exit(1);
  }

  // Create Discord client
  const client = new Client({
    intents: config.intents,
  });

  // Load events
  console.log('📂 Loading events...');
  await eventHandler.loadEvents(client);

  // Load commands
  console.log('📂 Loading commands...');
  await commandHandler.loadCommands(client);

  // Start web server
  if (config.webEnabled) {
    console.log('🌐 Starting web dashboard...');
    startWebServer();
  }

  // Login to Discord
  console.log('🔐 Logging in to Discord...\n');
  await client.login(config.token);
}

// Handle errors
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
main().catch((error) => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});

