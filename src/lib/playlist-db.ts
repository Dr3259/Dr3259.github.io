// 歌单数据存储 - 使用localStorage避免与原有数据库冲突
import type { Playlist, VirtualPlaylist, FolderPlaylist, AllMusicPlaylist, PlaylistTrackRef } from './playlist-types';
import type { TrackMetadata } from './db';

export interface ExtendedTrackMetadata extends TrackMetadata {
  source: 'folder';
  originalPath: string;
}

const PLAYLIST_STORAGE_KEY = 'weekglance_playlists_v1';

// 实际的数据库操作实现 - 使用localStorage
export class PlaylistDB {
  private getPlaylists(): Playlist[] {
    try {
      const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // 转换日期字符串回Date对象
      return parsed.map((playlist: any) => ({
        ...playlist,
        createdAt: new Date(playlist.createdAt),
        updatedAt: new Date(playlist.updatedAt),
        lastScanTime: playlist.lastScanTime ? new Date(playlist.lastScanTime) : undefined,
        tracks: playlist.tracks?.map((track: any) => ({
          ...track,
          addedAt: new Date(track.addedAt),
        })) || [],
      }));
    } catch {
      return [];
    }
  }

  private savePlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }
  }

  // 虚拟歌单操作
  async createVirtualPlaylist(name: string, description?: string): Promise<VirtualPlaylist> {
    const playlist: VirtualPlaylist = {
      id: `virtual-${Date.now()}-${Math.random()}`,
      name,
      description,
      type: 'virtual',
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      trackCount: 0,
    };

    const playlists = this.getPlaylists();
    playlists.push(playlist);
    this.savePlaylists(playlists);
    
    return playlist;
  }

  async updateVirtualPlaylist(id: string, updates: Partial<VirtualPlaylist>): Promise<void> {
    const playlists = this.getPlaylists();
    const index = playlists.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    
    const existing = playlists[index];
    if (existing.type !== 'virtual') {
      throw new Error('Target playlist is not virtual');
    }
    playlists[index] = { ...(existing as VirtualPlaylist), ...updates, updatedAt: new Date() };
    this.savePlaylists(playlists);
  }

  async updateAllMusicPlaylist(id: string, updates: Partial<AllMusicPlaylist>): Promise<void> {
    const playlists = this.getPlaylists();
    const index = playlists.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    
    const playlist = playlists[index];
    if (playlist.type === 'all') {
      playlists[index] = { ...playlist, ...updates, updatedAt: new Date() } as AllMusicPlaylist;
      this.savePlaylists(playlists);
    }
  }

  async deleteVirtualPlaylist(id: string): Promise<void> {
    const playlists = this.getPlaylists();
    const filtered = playlists.filter(p => p.id !== id);
    this.savePlaylists(filtered);
  }

  async addTrackToVirtualPlaylist(trackId: string, playlistId: string): Promise<void> {
    const playlists = this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId) as VirtualPlaylist;
    
    if (!playlist || playlist.type !== 'virtual') {
      throw new Error('Playlist not found or not virtual');
    }
    
    const trackRef: PlaylistTrackRef = {
      trackId,
      addedAt: new Date(),
      order: playlist.tracks.length,
    };
    
    playlist.tracks.push(trackRef);
    playlist.trackCount = playlist.tracks.length;
    playlist.updatedAt = new Date();
    
    this.savePlaylists(playlists);
  }

  async removeTrackFromVirtualPlaylist(trackId: string, playlistId: string): Promise<void> {
    const playlists = this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId) as VirtualPlaylist;
    
    if (!playlist || playlist.type !== 'virtual') {
      throw new Error('Playlist not found or not virtual');
    }
    
    playlist.tracks = playlist.tracks.filter(ref => ref.trackId !== trackId);
    playlist.trackCount = playlist.tracks.length;
    playlist.updatedAt = new Date();
    
    this.savePlaylists(playlists);
  }
  
  // 通用操作
  async getAllPlaylists(): Promise<Playlist[]> {
    return this.getPlaylists();
  }

  async getPlaylistById(id: string): Promise<Playlist | null> {
    const playlists = this.getPlaylists();
    return playlists.find(p => p.id === id) || null;
  }
}

// 文件夹扫描功能
export class FolderScanner {
  private supportedExtensions = ['.mp3', '.flac', '.wav', '.ogg', '.m4a'];
  
  async scanFolder(dirHandle: FileSystemDirectoryHandle): Promise<{
    tracks: ExtendedTrackMetadata[];
    totalFiles: number;
  }> {
    const tracks: ExtendedTrackMetadata[] = [];
    let totalFiles = 0;
    
    for await (const [name, handle] of (dirHandle as any).entries()) {
      if (handle.kind === 'file') {
        totalFiles++;
        const extension = this.getFileExtension(name);
        
        if (this.supportedExtensions.includes(extension.toLowerCase())) {
          const file = await handle.getFile();
          const track = await this.createTrackFromFile(file, dirHandle.name);
          tracks.push(track);
        }
      }
    }
    
    return { tracks, totalFiles };
  }
  
  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }
  
  private async createTrackFromFile(
    file: File, 
    folderName: string
  ): Promise<ExtendedTrackMetadata> {
    // 解析文件名获取艺术家和标题
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    let title = fileName;
    let artist: string | undefined;
    
    const parts = fileName.split(' - ');
    if (parts.length > 1) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }
    
    // 获取音频时长
    const duration = await this.getAudioDuration(file);
    
    return {
      id: `folder-track-${Date.now()}-${Math.random()}`,
      title,
      artist,
      duration,
      type: file.type,
      source: 'folder',
      originalPath: file.name,
      virtualPlaylists: [],
      category: null,
    };
  }
  
  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        URL.revokeObjectURL(url);
      };
      
      audio.onerror = () => {
        resolve(0);
        URL.revokeObjectURL(url);
      };
      
      audio.src = url;
    });
  }
}
