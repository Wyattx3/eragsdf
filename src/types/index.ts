import { 
  VoiceConnection, 
  AudioPlayer, 
  AudioResource 
} from '@discordjs/voice';
import { 
  ChatInputCommandInteraction,
  Message, 
  TextChannel, 
  VoiceChannel 
} from 'discord.js';

export interface Song {
  title: string;
  url: string;
  duration: number;
  thumbnail: string;
  requestedBy: string;
  channel: string;
}

export interface QueueOptions {
  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
}

export interface MusicQueue {
  songs: Song[];
  connection: VoiceConnection | null;
  player: AudioPlayer | null;
  resource: AudioResource | null;
  volume: number;
  loopMode: LoopMode;
  isPlaying: boolean;
  filters: AudioFilter[];
  mode247: boolean;
  skipVotes: Set<string>;
  skipVotesNeeded: number;
  autoplay: boolean;
  lastPlayedSong: Song | null;
  nowPlayingMessage: Message | null;
}

export enum LoopMode {
  OFF = 'off',
  SONG = 'song',
  QUEUE = 'queue',
}

export enum AudioFilter {
  BASSBOOST = 'bassboost',
  NIGHTCORE = 'nightcore',
  VAPORWAVE = 'vaporwave',
  EIGHTD = '8d',
  KARAOKE = 'karaoke',
  TREBLEBASS = 'treblebass',
}

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  category: 'music' | 'utility';
  options?: CommandOption[];
  execute: (
    interaction: ChatInputCommandInteraction | Message,
    args?: string[]
  ) => Promise<void>;
}

export interface CommandOption {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: { name: string; value: string }[];
}

export interface DashboardStats {
  totalServers: number;
  totalSongs: number;
  activeConnections: number;
  uptime: number;
}

export interface ServerQueueData {
  guildId: string;
  guildName: string;
  currentSong: Song | null;
  queue: Song[];
  volume: number;
  isPlaying: boolean;
  loopMode: LoopMode;
}

