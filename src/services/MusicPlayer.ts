import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember, VoiceChannel } from 'discord.js';
import play from 'play-dl';
import { queueManager } from './QueueManager';
import { Song, AudioFilter, LoopMode } from '../types';
import { config } from '../config';
import { createPremiumNowPlayingEmbed } from '../utils/embedBuilder';
import { createMusicControlButtons } from '../utils/buttonBuilder';

export class MusicPlayer {
  private disconnectTimers: Map<string, NodeJS.Timeout> = new Map();

  async play(
    member: GuildMember,
    voiceChannel: VoiceChannel,
    song?: Song
  ): Promise<void> {
    const guildId = member.guild.id;
    let queue = queueManager.getQueue(guildId);

    if (!queue) {
      throw new Error('Queue မတွေ့ပါ');
    }

    this.clearDisconnectTimer(guildId);

    if (!queue.connection) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
      });

      queueManager.setConnection(guildId, connection);
      queue = queueManager.getQueue(guildId)!;

      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch {
          connection.destroy();
          queueManager.deleteQueue(guildId);
        }
      });
    }

    if (!queue.player) {
      const player = createAudioPlayer();
      queueManager.setPlayer(guildId, player);
      queue = queueManager.getQueue(guildId)!;

      queue.connection!.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        this.handleSongEnd(guildId);
      });

      player.on('error', (error) => {
        console.error(`Audio player error:`, error);
        this.handleSongEnd(guildId);
      });
    }

    await this.playSong(guildId);
  }

  private async playSong(guildId: string): Promise<void> {
    const queue = queueManager.getQueue(guildId);
    if (!queue || queue.songs.length === 0) {
      queue!.isPlaying = false;
      
      if (!queue!.mode247) {
        this.setDisconnectTimer(guildId);
      }
      return;
    }

    const song = queue.songs[0];

    try {
      const stream = await play.stream(song.url, {
        quality: 2, // High quality
      });
      
      const filters: string[] = [];
      
      queue.filters.forEach((filter) => {
        switch (filter) {
          case AudioFilter.BASSBOOST:
            filters.push('bass=g=10');
            break;
          case AudioFilter.NIGHTCORE:
            filters.push('asetrate=48000*1.25,aresample=48000');
            break;
          case AudioFilter.VAPORWAVE:
            filters.push('asetrate=48000*0.8,aresample=48000');
            break;
          case AudioFilter.EIGHTD:
            filters.push('apulsator=hz=0.125');
            break;
          case AudioFilter.KARAOKE:
            filters.push('stereotools=mlev=0.1');
            break;
        }
      });

      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
        inlineVolume: true,
      });

      if (resource.volume) {
        resource.volume.setVolume(queue.volume / 100);
      }

      queue.resource = resource;
      queue.player!.play(resource);
      queue.isPlaying = true;
      
      // Update now playing message
      await this.updateNowPlayingMessage(guildId, song);
    } catch (error: any) {
      console.error('Play error:', error?.message || error);
      
      // Remove failed song and try next
      const failedSong = queueManager.skipSong(guildId);
      
      // Notify if it was a YouTube auth issue
      if (error?.message?.includes('Sign in') || error?.message?.includes('bot')) {
        console.warn('⚠️  YouTube authentication issue - video skipped');
        console.warn('   Some videos may require YouTube cookies');
        console.warn('   See YOUTUBE_SETUP.md for details');
      }
      
      // Try next song
      await this.playSong(guildId);
    }
  }

  private async handleSongEnd(guildId: string): Promise<void> {
    const queue = queueManager.getQueue(guildId);
    if (!queue) return;

    // Save last played song for autoplay
    if (queue.songs[0]) {
      queueManager.setLastPlayedSong(guildId, queue.songs[0]);
    }

    if (queue.loopMode === LoopMode.SONG && queue.songs[0]) {
      // Replay current song
      await this.playSong(guildId);
    } else {
      queueManager.skipSong(guildId);
      
      // Check if queue is empty and autoplay is enabled
      if (queue.songs.length === 0 && queue.autoplay && queue.lastPlayedSong) {
        await this.addAutoplaySong(guildId);
      }
      
      await this.playSong(guildId);
    }
  }

  private async addAutoplaySong(guildId: string): Promise<void> {
    const queue = queueManager.getQueue(guildId);
    if (!queue || !queue.lastPlayedSong) return;

    try {
      console.log('🎵 Auto-play: Finding related tracks...');
      
      const { youtubeService } = await import('./YouTubeService');
      const relatedSongs = await youtubeService.getRelatedTracks(queue.lastPlayedSong, 1);
      
      if (relatedSongs.length > 0) {
        const song = relatedSongs[0];
        song.requestedBy = 'Auto-play 🎵';
        
        const added = queueManager.addSong(guildId, song);
        if (added) {
          console.log(`✅ Auto-play added: ${song.title}`);
        }
      }
    } catch (error) {
      console.error('Auto-play error:', error);
    }
  }

  pause(guildId: string): boolean {
    const queue = queueManager.getQueue(guildId);
    if (!queue || !queue.player) return false;

    const paused = queue.player.pause();
    if (paused) {
      queue.isPlaying = false;
    }
    return paused;
  }

  resume(guildId: string): boolean {
    const queue = queueManager.getQueue(guildId);
    if (!queue || !queue.player) return false;

    const resumed = queue.player.unpause();
    if (resumed) {
      queue.isPlaying = true;
    }
    return resumed;
  }

  stop(guildId: string): void {
    const queue = queueManager.getQueue(guildId);
    if (!queue) return;

    queue.player?.stop();
    queueManager.clearQueue(guildId);
    
    if (!queue.mode247) {
      queue.connection?.destroy();
      queueManager.deleteQueue(guildId);
    }
  }

  async skip(guildId: string): Promise<Song | null> {
    const skipped = queueManager.skipSong(guildId);
    
    if (skipped) {
      await this.playSong(guildId);
    }
    
    return skipped;
  }

  private setDisconnectTimer(guildId: string): void {
    this.clearDisconnectTimer(guildId);

    const timer = setTimeout(() => {
      const queue = queueManager.getQueue(guildId);
      if (queue && !queue.isPlaying && !queue.mode247) {
        queue.connection?.destroy();
        queueManager.deleteQueue(guildId);
      }
    }, config.autoDisconnectTime);

    this.disconnectTimers.set(guildId, timer);
  }

  private clearDisconnectTimer(guildId: string): void {
    const timer = this.disconnectTimers.get(guildId);
    if (timer) {
      clearTimeout(timer);
      this.disconnectTimers.delete(guildId);
    }
  }

  private async updateNowPlayingMessage(guildId: string, song: Song): Promise<void> {
    try {
      const queue = queueManager.getQueue(guildId);
      if (!queue) return;

      const message = queueManager.getNowPlayingMessage(guildId);
      if (!message) return;

      // Check if song was added by autoplay
      const isAutoplay = song.requestedBy === 'Auto-play 🎵';
      
      // Create premium embed with progress bar
      const embed = createPremiumNowPlayingEmbed(song, 0, isAutoplay || queue.autoplay);
      
      // Update the message with new song info
      await message.edit({
        embeds: [embed],
        components: createMusicControlButtons(),
      });
    } catch (error: any) {
      // Message might have been deleted or permissions issue
      console.log('⚠️ Could not update now playing message:', error?.message);
    }
  }
}

export const musicPlayer = new MusicPlayer();

