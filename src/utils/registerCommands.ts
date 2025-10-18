import { REST, Routes } from 'discord.js';
import { config, validateConfig } from '../config';
import { commandHandler } from '../handlers/commandHandler';
import { Client } from 'discord.js';

export async function registerCommands() {
  console.log('🔄 Registering slash commands...\n');

  if (!validateConfig()) {
    console.warn('⚠️  Configuration validation failed - commands will be registered on bot start');
    return false;
  }

  // Create a temporary client just to load commands
  const client = new Client({ intents: [] });

  try {
    await commandHandler.loadCommands(client);

    const commands = Array.from(commandHandler.commands.values()).map((cmd) =>
      cmd.data.toJSON()
    );

    const rest = new REST({ version: '10' }).setToken(config.token);

    console.log(`📦 Registering ${commands.length} slash commands globally...`);

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });

    console.log('✅ Successfully registered slash commands!\n');
    return true;
  } catch (error: any) {
    console.warn('⚠️  Could not register commands:', error?.message);
    console.log('💡 Commands will be registered when bot starts\n');
    return false;
  }
}

// Only run directly if called as main script
if (require.main === module) {
  registerCommands().then((success) => {
    process.exit(success ? 0 : 0); // Always exit 0 to allow bot to start
  });
}

