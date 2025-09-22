// 歌单类型定义
export type PlaylistType = 'virtual' | 'folder' | 'all';

export interface BasePlaylist {
    id: string;
    name: string;
    type: PlaylistType;
    createdAt: Date;
    updatedAt: Date;
    trackCount: number;
}

// 虚拟歌单 - 用户手动创建和管理
export interface VirtualPlaylist extends BasePlaylist {
    type: 'virtual';
    description?: string;
    tracks: PlaylistTrackRef[]; // 使用引用而不是直接存储ID数组
    coverImage?: string; // 可选的封面图片
}

// 文件夹歌单 - 映射本地文件夹
export interface FolderPlaylist extends BasePlaylist {
    type: 'folder';
    folderPath: string; // 本地文件夹路径
    folderHandle?: FileSystemDirectoryHandle; // File System Access API句柄
    lastScanTime: Date; // 上次扫描时间
    autoRefresh: boolean; // 是否自动刷新
}

// 所有音乐歌单 - 系统默认歌单，包含所有已上传的音乐
export interface AllMusicPlaylist extends BasePlaylist {
    type: 'all';
    isDefault: true; // 标记为默认歌单
}

export type Playlist = VirtualPlaylist | FolderPlaylist | AllMusicPlaylist;

// 歌单中的歌曲引用，不修改原有TrackMetadata
export interface PlaylistTrackRef {
    trackId: string; // 引用原有tracks中的ID
    addedAt: Date; // 添加到歌单的时间
    order?: number; // 在歌单中的排序
}

// 为了向后兼容，保持使用原有的TrackMetadata
// 歌单功能通过引用ID的方式与原有系统集成