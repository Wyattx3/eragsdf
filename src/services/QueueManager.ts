import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  VoiceConnection 
} from '@discordjs/voice';
import { 
  Song, 
  MusicQueue, 
  QueueOptions, 
  LoopMode, 
  AudioFilter 
} from '../types';
import { config } from '../config';

export class QueueManager {
  private queues: Map<string, MusicQueue> = new Map();

  public createQueue(guildId: string, options: QueueOptions): MusicQueue {
    const queue: MusicQueue = {
      songs: [],
      connection: null,
      player: null,
      resource: null,
      volume: config.defaultVolume,
      loopMode: LoopMode.OFF,
      isPlaying: false,
      filters: [],
      mode247: config.default247Mode,
      skipVotes: new Set(),
      skipVotesNeeded: 0,
      autoplay: false,
      lastPlayedSong: null,
      nowPlayingMessage: null,
    };

    this.queues.set(guildId, queue);
    return queue;
  }

  public getQueue(guildId: string): MusicQueue | undefined {
    return this.queues.get(guildId);
  }

  public deleteQueue(guildId: string): void {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.connection?.destroy();
      queue.player?.stop();
      this.queues.delete(guildId);
    }
  }

  public addSong(guildId: string, song: Song): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) return false;

    if (queue.songs.length >= config.maxQueueSize) {
      return false;
    }

    queue.songs.push(song);
    return true;
  }

  public removeSong(guildId: string, index: number): Song | null {
    const queue = this.queues.get(guildId);
    if (!queue || index < 0 || index >= queue.songs.length) {
      return null;
    }

    const removed = queue.songs.splice(index, 1);
    return removed[0] || null;
  }

  public getCurrentSong(guildId: string): Song | null {
    const queue = this.queues.get(guildId);
    return queue?.songs[0] || null;
  }

  public skipSong(guildId: string): Song | null {
    const queue = this.queues.get(guildId);
    if (!queue || queue.songs.length === 0) return null;

    const skipped = queue.songs.shift();
    
    if (queue.loopMode === LoopMode.QUEUE && skipped) {
      queue.songs.push(skipped);
    }

    queue.skipVotes.clear();
    return skipped || null;
  }

  public shuffle(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue || queue.songs.length <= 1) return false;

    const currentSong = queue.songs.shift();
    
    for (let i = queue.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue.songs[i], queue.songs[j]] = [queue.songs[j], queue.songs[i]];
    }

    if (currentSong) {
      queue.songs.unshift(currentSong);
    }

    return true;
  }

  public clearQueue(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) return false;

    queue.songs = [];
    return true;
  }

  public setLoopMode(guildId: string, mode: LoopMode): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) return false;

    queue.loopMode = mode;
    return true;
  }

  public setVolume(guildId: string, volume: number): boolean {
    const queue = this.queues.get(guildId);
    if (!queue || volume < 0 || volume > 100) return false;

    queue.volume = volume;
    
    if (queue.resource && queue.resource.volume) {
      queue.resource.volume.setVolume(volume / 100);
    }

    return true;
  }

  public toggleFilter(guildId: string, filter: AudioFilter): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) return false;

    const index = queue.filters.indexOf(filter);
    if (index === -1) {
      queue.filters.push(filter);
    } else {
      queue.filters.splice(index, 1);
    }

    return true;
  }

  public addSkipVote(guildId: string, userId: string): {
    voted: boolean;
    votes: number;
    needed: number;
  } {
    const queue = this.queues.get(guildId);
    if (!queue) {
      return { voted: false, votes: 0, needed: 0 };
    }

    queue.skipVotes.add(userId);
    
    return {
      voted: true,
      votes: queue.skipVotes.size,
      needed: queue.skipVotesNeeded,
    };
  }

  public setConnection(
    guildId: string, 
    connection: VoiceConnection
  ): void {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.connection = connection;
    }
  }

  public setPlayer(guildId: string, player: AudioPlayer): void {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.player = player;
    }
  }

  public toggleAutoplay(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) return false;

    queue.autoplay = !queue.autoplay;
    return queue.autoplay;
  }

  public setLastPlayedSong(guildId: string, song: Song): void {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.lastPlayedSong = song;
    }
  }

  public getAllQueues(): Map<string, MusicQueue> {
    return this.queues;
  }

  public getActiveQueuesCount(): number {
    return Array.from(this.queues.values()).filter(
      (q) => q.isPlaying
    ).length;
  }

  public setNowPlayingMessage(guildId: string, message: any): void {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.nowPlayingMessage = message;
    }
  }

  public getNowPlayingMessage(guildId: string): any | null {
    const queue = this.queues.get(guildId);
    return queue?.nowPlayingMessage || null;
  }
}

export const queueManager = new QueueManager();

