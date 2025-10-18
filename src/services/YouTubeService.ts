import play, { 
  SoundCloudTrack,
  validate as validateURL 
} from 'play-dl';
import { Song } from '../types';

export class MusicService {
  async search(query: string, limit: number = 1): Promise<Song[]> {
    try {
      const results = await play.search(query, { limit, source: { soundcloud: 'tracks' } });
      return results.map((track) => this.formatSoundCloudSong(track as any));
    } catch (error: any) {
      console.error('SoundCloud search error:', error);
      
      // Check if it's a client_id error
      if (error?.message?.includes('client_id') || error?.toString()?.includes('client_id')) {
        throw new Error('⚠️ SoundCloud ကို initialize မလုပ်ရသေးပါ။ Bot ကို restart လုပ်ပါ။');
      }
      
      throw new Error('ဂီတရှာဖွေမှု မအောင်မြင်ပါ။ ထပ်ကြိုးစားကြည့်ပါ။');
    }
  }

  async getRelatedTracks(song: Song, limit: number = 1): Promise<Song[]> {
    try {
      // Extract artist/title for better search
      const searchTerms = [
        song.channel, // Artist name
        song.title.split('-')[0].trim(), // First part of title
        song.title.split(' ').slice(0, 3).join(' '), // First 3 words
      ].filter(Boolean);

      // Try to find similar tracks
      for (const term of searchTerms) {
        try {
          const results = await play.search(term, { 
            limit: limit + 5, // Get more to filter out the same song
            source: { soundcloud: 'tracks' } 
          });
          
          // Filter out the same song
          const filtered = results
            .filter((track: any) => {
              const trackUrl = track.url || track.permalink;
              return trackUrl !== song.url;
            })
            .slice(0, limit)
            .map((track: any) => this.formatSoundCloudSong(track));

          if (filtered.length > 0) {
            return filtered;
          }
        } catch (err) {
          continue;
        }
      }

      // Fallback: search by genre or general terms
      const fallbackSearch = await play.search('popular music', { 
        limit, 
        source: { soundcloud: 'tracks' } 
      });
      
      return fallbackSearch.map((track: any) => this.formatSoundCloudSong(track));
    } catch (error) {
      console.error('Related tracks error:', error);
      // Return empty array instead of throwing
      return [];
    }
  }


  async validateAndGetSongs(
    input: string, 
    requestedBy: string
  ): Promise<Song[]> {
    const urlType = await validateURL(input);

    // SoundCloud Track
    if (urlType === 'so_track') {
      const song = await this.getSoundCloudTrack(input);
      song.requestedBy = requestedBy;
      return [song];
    }

    // SoundCloud Playlist
    if (urlType === 'so_playlist') {
      const songs = await this.getSoundCloudPlaylist(input);
      songs.forEach(song => song.requestedBy = requestedBy);
      return songs;
    }

    // Search query - SoundCloud only
    const songs = await this.search(input, 1);
    if (songs.length === 0) {
      throw new Error('ရလဒ် မတွေ့ပါ');
    }
    
    songs[0].requestedBy = requestedBy;
    return songs;
  }

  async getSoundCloudTrack(url: string): Promise<Song> {
    try {
      const track = await play.soundcloud(url);
      
      if (!track) {
        throw new Error('Track ရှာမတွေ့ပါ');
      }

      return this.formatSoundCloudSong(track);
    } catch (error) {
      console.error('SoundCloud track error:', error);
      throw new Error('SoundCloud track ရယူ၍မရပါ');
    }
  }

  async getSoundCloudPlaylist(url: string): Promise<Song[]> {
    try {
      const playlist = await play.soundcloud(url);
      
      if (!playlist || playlist.type !== 'playlist') {
        throw new Error('Playlist ရှာမတွေ့ပါ');
      }

      const tracks = await (playlist as any).all_tracks();
      return tracks.map((track: any) => this.formatSoundCloudSong(track));
    } catch (error) {
      console.error('SoundCloud playlist error:', error);
      throw new Error('SoundCloud playlist ရယူ၍မရပါ');
    }
  }

  private formatSoundCloudSong(track: any): Song {
    return {
      title: track.name || track.title || 'Unknown',
      url: track.url,
      duration: track.durationInSec || Math.floor(track.durationInMs / 1000) || 0,
      thumbnail: track.thumbnail || '',
      requestedBy: '',
      channel: track.user?.name || track.publisher?.name || 'SoundCloud',
    };
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const youtubeService = new MusicService();
export const musicService = youtubeService; // Alias

