import { BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import { commandHandler } from '../handlers/commandHandler';
import { buttonHandler } from '../handlers/buttonHandler';
import { createErrorEmbed } from '../utils/embedBuilder';

export const name = 'interactionCreate';

export async function execute(interaction: BaseInteraction): Promise<void> {
  // Handle button interactions
  if (interaction.isButton()) {
    try {
      if (interaction.customId.startsWith('music_') || interaction.customId.startsWith('queue_')) {
        await buttonHandler.handleMusicButton(interaction);
      }
    } catch (error) {
      console.error('❌ Error handling button:', error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [createErrorEmbed('အမှား', 'Button action မအောင်မြင်ပါ')],
          ephemeral: true,
        });
      }
    }
    return;
  }

  // Handle slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = commandHandler.getCommand(interaction.commandName);

  if (!command) {
    console.error(`❌ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction as ChatInputCommandInteraction);
  } catch (error: any) {
    console.error(`❌ Error executing command ${interaction.commandName}:`, error);

    // Ignore "Unknown interaction" errors (interaction expired)
    if (error?.code === 10062 || error?.message?.includes('Unknown interaction')) {
      console.log('⚠️ Interaction expired - this is normal for slow operations');
      return;
    }

    // Ignore "Interaction already acknowledged" errors
    if (error?.code === 40060 || error?.message?.includes('already been acknowledged')) {
      console.log('⚠️ Interaction already acknowledged');
      return;
    }

    const errorEmbed = createErrorEmbed(
      'အမှား ဖြစ်ပေါ်ခဲ့သည်',
      'Command ကို လုပ်ဆောင်ရာတွင် အမှား ဖြစ်ပေါ်ခဲ့သည်'
    );

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          embeds: [errorEmbed],
          flags: [4096], // EPHEMERAL flag
        });
      } else {
        await interaction.reply({
          embeds: [errorEmbed],
          flags: [4096], // EPHEMERAL flag
        });
      }
    } catch (replyError: any) {
      // Silently fail if we can't send error message
      console.log('⚠️ Could not send error reply:', replyError?.message);
    }
  }
}

