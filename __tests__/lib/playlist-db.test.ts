import { PlaylistDB } from '@/lib/playlist-db';

describe('PlaylistDB', () => {
  let db: PlaylistDB;

  beforeEach(() => {
    db = new PlaylistDB();
    localStorage.clear();
  });

  it('creates a virtual playlist and persists it', async () => {
    const p = await db.createVirtualPlaylist('My List', 'desc');
    const all = await db.getAllPlaylists();
    expect(all.find(x => x.id === p.id)).toBeDefined();
    expect(p.type).toBe('virtual');
    expect(p.trackCount).toBe(0);
  });

  it('adds and removes a track from virtual playlist', async () => {
    const p = await db.createVirtualPlaylist('My List');
    await db.addTrackToVirtualPlaylist('track-1', p.id);
    let found = await db.getPlaylistById(p.id);
    expect(found && found.type === 'virtual' && found.tracks.length).toBe(1);

    await db.removeTrackFromVirtualPlaylist('track-1', p.id);
    found = await db.getPlaylistById(p.id);
    expect(found && found.type === 'virtual' && found.tracks.length).toBe(0);
  });

  it('updates virtual playlist metadata', async () => {
    const p = await db.createVirtualPlaylist('List');
    await db.updateVirtualPlaylist(p.id, { description: 'updated' });
    const found = await db.getPlaylistById(p.id);
    expect(found && found.type === 'virtual' && found.description).toBe('updated');
  });
});
