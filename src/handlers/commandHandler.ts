import { Client, Collection, REST, Routes } from 'discord.js';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

export interface BotCommand {
  data: any;
  execute: (interaction: any, args?: string[]) => Promise<void>;
}

export class CommandHandler {
  public commands: Collection<string, BotCommand> = new Collection();
  public prefixCommands: Collection<string, BotCommand> = new Collection();

  async loadCommands(client: Client): Promise<void> {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js') && file !== 'index.js');

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data.name, command);
          this.prefixCommands.set(command.data.name, command);
          
          console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
          console.log(
            `⚠️  Command at ${filePath} is missing "data" or "execute"`
          );
        }
      }
    }

    console.log(`\n📦 Total commands loaded: ${this.commands.size}\n`);
  }

  async registerSlashCommands(): Promise<void> {
    const commands = Array.from(this.commands.values()).map((cmd) =>
      cmd.data.toJSON()
    );

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
      console.log('🔄 Registering slash commands...');

      await rest.put(Routes.applicationCommands(config.clientId), {
        body: commands,
      });

      console.log('✅ Successfully registered slash commands globally!\n');
    } catch (error) {
      console.error('❌ Error registering slash commands:', error);
    }
  }

  getCommand(name: string): BotCommand | undefined {
    return this.commands.get(name);
  }

  getPrefixCommand(name: string): BotCommand | undefined {
    return this.prefixCommands.get(name);
  }
}

export const commandHandler = new CommandHandler();

