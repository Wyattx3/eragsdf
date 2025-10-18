import { EmbedBuilder } from 'discord.js';
import { config } from '../config';
import { Song, LoopMode } from '../types';
import { youtubeService } from '../services/YouTubeService';

export function createSuccessEmbed(
  title: string, 
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle(`${config.emojis.success} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createErrorEmbed(
  title: string, 
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.colors.error)
    .setTitle(`${config.emojis.error} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createMusicEmbed(
  title: string, 
  description: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${config.emojis.music} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createNowPlayingEmbed(song: Song): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${config.emojis.play} လက်ရှိ ဖွင့်နေသော သီချင်း`)
    .setDescription(`**[${song.title}](${song.url})**`)
    .addFields(
      { name: 'ကြာချိန်', value: youtubeService.formatDuration(song.duration), inline: true },
      { name: 'Channel', value: song.channel, inline: true },
      { name: 'တောင်းဆိုသူ', value: song.requestedBy, inline: true }
    )
    .setThumbnail(song.thumbnail)
    .setTimestamp();
}

export function createQueueEmbed(
  songs: Song[], 
  currentPage: number, 
  totalPages: number
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.colors.info)
    .setTitle(`${config.emojis.queue} သီချင်းစာရင်း`)
    .setFooter({ text: `စာမျက်နှာ ${currentPage}/${totalPages}` })
    .setTimestamp();

  if (songs.length === 0) {
    embed.setDescription('စာရင်းတွင် သီချင်း မရှိပါ');
    return embed;
  }

  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const pageSongs = songs.slice(start, end);

  let description = '';
  pageSongs.forEach((song, index) => {
    const position = start + index;
    const icon = position === 0 ? config.emojis.play : `${position}.`;
    description += `${icon} **[${song.title}](${song.url})**\n`;
    description += `   ⏱️ ${youtubeService.formatDuration(song.duration)} | 👤 ${song.requestedBy}\n\n`;
  });

  embed.setDescription(description);
  return embed;
}

export function createLoopEmbed(mode: LoopMode): EmbedBuilder {
  let description = '';
  
  switch (mode) {
    case LoopMode.OFF:
      description = 'Loop mode ကို **ပိတ်ထား**ပါသည်';
      break;
    case LoopMode.SONG:
      description = 'လက်ရှိသီချင်းကို **ထပ်တလဲလဲ ဖွင့်**မည်';
      break;
    case LoopMode.QUEUE:
      description = 'သီချင်းစာရင်းတစ်ခုလုံးကို **ထပ်တလဲလဲ ဖွင့်**မည်';
      break;
  }

  return new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle(`${config.emojis.loop} Loop Mode`)
    .setDescription(description)
    .setTimestamp();
}

export function createProgressBar(current: number, total: number, length: number = 20): string {
  if (total === 0) return '━'.repeat(length);
  
  const progress = Math.min(current / total, 1);
  const filled = Math.floor(progress * length);
  const empty = length - filled;
  
  const filledBar = '━'.repeat(filled);
  const emptyBar = '─'.repeat(empty);
  
  return `${filledBar}🔘${emptyBar}`;
}

export function createPremiumNowPlayingEmbed(
  song: Song, 
  position: number = 0,
  isAutoplay: boolean = false
): EmbedBuilder {
  const progressBar = createProgressBar(position, song.duration);
  const currentTime = youtubeService.formatDuration(position);
  const totalTime = youtubeService.formatDuration(song.duration);
  
  const autoplayBadge = isAutoplay ? '🎵 Auto-play' : '';
  
  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${config.emojis.play} ယခု ဖွင့်နေပါသည်`)
    .setDescription(`**[${song.title}](${song.url})**\n\n${progressBar}\n\`${currentTime}\` ━━━━━━━━━━━━ \`${totalTime}\``)
    .addFields(
      { name: '👤 တောင်းဆိုသူ', value: song.requestedBy, inline: true },
      { name: '📺 Channel', value: song.channel || 'SoundCloud', inline: true },
      { name: '🎵 ကြာချိန်', value: totalTime, inline: true }
    )
    .setThumbnail(song.thumbnail)
    .setTimestamp();
  
  if (autoplayBadge) {
    embed.setFooter({ text: autoplayBadge });
  }
  
  return embed;
}

