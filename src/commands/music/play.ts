import { 
  ChatInputCommandInteraction,
  GuildMember, 
  SlashCommandBuilder, 
  VoiceChannel 
} from 'discord.js';
import { queueManager } from '../../services/QueueManager';
import { musicPlayer } from '../../services/MusicPlayer';
import { youtubeService } from '../../services/YouTubeService';
import { validateMusicCommand } from '../../utils/validators';
import { createSuccessEmbed, createErrorEmbed, createMusicEmbed } from '../../utils/embedBuilder';
import { config } from '../../config';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('သီချင်း ဖွင့်ပါ')
  .addStringOption(option =>
    option
      .setName('song')
      .setDescription('သီချင်း URL သို့မဟုတ် ရှာဖွေမည့် စာသား')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    await interaction.deferReply();
  } catch (error: any) {
    // If deferReply fails, the interaction likely expired
    console.log('⚠️ Could not defer reply:', error?.message);
    return;
  }

  const validation = await validateMusicCommand(interaction);
  if (!validation.success) {
    try {
      await interaction.editReply({
        embeds: [createErrorEmbed('အမှား', validation.error!)],
      });
    } catch (error) {
      console.log('⚠️ Could not edit reply - interaction may have expired');
    }
    return;
  }

  const { member, voiceChannel } = validation;
  const query = interaction.options.get('song')?.value as string;

  try {
    const songs = await youtubeService.validateAndGetSongs(
      query,
      member!.user.tag
    );

    if (songs.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('အမှား', 'သီချင်း မတွေ့ပါ')],
      });
      return;
    }

    const guildId = interaction.guildId!;
    let queue = queueManager.getQueue(guildId);

    if (!queue) {
      queue = queueManager.createQueue(guildId, {
        textChannel: interaction.channel as any,
        voiceChannel: voiceChannel!,
      });
    }

    if (songs.length === 1) {
      const added = queueManager.addSong(guildId, songs[0]);
      
      if (!added) {
        await interaction.editReply({
          embeds: [createErrorEmbed('အမှား', `သီချင်းစာရင်း ပြည့်နေပါပြီ (အများဆုံး ${config.maxQueueSize})`)],
        });
        return;
      }

      if (queue.songs.length === 1) {
        await musicPlayer.play(member!, voiceChannel!, songs[0]);
        
        await interaction.editReply({
          embeds: [
            createMusicEmbed(
              'ယခု ဖွင့်နေပါသည်',
              `**[${songs[0].title}](${songs[0].url})**\n\n⏱️ ${youtubeService.formatDuration(songs[0].duration)}`
            ).setThumbnail(songs[0].thumbnail)
          ],
        });
      } else {
        await interaction.editReply({
          embeds: [
            createSuccessEmbed(
              'စာရင်းထဲ ထည့်ပြီးပါပြီ',
              `**[${songs[0].title}](${songs[0].url})**\n\nအနေအထား: ${queue.songs.length}`
            ).setThumbnail(songs[0].thumbnail)
          ],
        });
      }
    } else {
      // Playlist
      let added = 0;
      for (const song of songs) {
        if (queueManager.addSong(guildId, song)) {
          added++;
        } else {
          break;
        }
      }

      if (added === 0) {
        await interaction.editReply({
          embeds: [createErrorEmbed('အမှား', 'သီချင်းစာရင်း ပြည့်နေပါပြီ')],
        });
        return;
      }

      if (queue.songs.length === added) {
        await musicPlayer.play(member!, voiceChannel!);
      }

      await interaction.editReply({
        embeds: [
          createSuccessEmbed(
            'Playlist ထည့်ပြီးပါပြီ',
            `${added} သီချင်းကို စာရင်းထဲထည့်ပြီးပါပြီ`
          )
        ],
      });
    }
  } catch (error: any) {
    console.error('Play command error:', error);
    try {
      await interaction.editReply({
        embeds: [createErrorEmbed('အမှား', error.message || 'သီချင်း ဖွင့်၍မရပါ')],
      });
    } catch (replyError) {
      console.log('⚠️ Could not send error message - interaction may have expired');
    }
  }
}

