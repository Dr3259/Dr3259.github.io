

const DB_NAME = 'WeekGlanceDB';
const DB_VERSION = 3; // Incremented version to add the new video store
const BOOK_STORE_NAME = 'books';
const MUSIC_STORE_NAME = 'musicTracks';
const VIDEO_STORE_NAME = 'videos'; // New store for videos

export interface Bookmark {
  page: number;
  title: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  type: 'txt' | 'pdf';
  bookmarks?: Bookmark[];
}

export interface BookWithContent extends BookMetadata {
  content: ArrayBuffer;
}

export interface TrackMetadata {
    id: string;
    title:string;
    artist?: string;
    album?: string;
    duration?: number;
    type: string; // e.g., 'audio/flac'
    category?: string | null;
    createdAt?: Date;
    order?: number; // Explicit order for tracks
}

export interface TrackWithContent extends TrackMetadata {
    content: Blob; // Store as Blob
}

export interface VideoFile {
    id: string; // e.g., 'video-timestamp'
    name: string;
    content: File;
}


let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;

      // Specific handling for version error
      if (error && error.name === 'VersionError') {
        // Close any potential open connection before deleting
        if (db) {
          db.close();
          db = null;
        }
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        deleteRequest.onsuccess = () => {
          window.location.reload();
        };
        deleteRequest.onerror = (deleteEvent) => {
          reject(new Error("Failed to delete and reset the database. Please clear site data manually."));
        };
        deleteRequest.onblocked = () => {
          reject(new Error("Database reset blocked. Please close other tabs of this app and reload."));
        };
      } else {
        reject(request.error);
      }
    };

    request.onsuccess = () => {
      db = request.result;
      
      // Ensure the onclose event is handled to prevent zombie connections
      db.onclose = () => {
        db = null;
      };

      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(BOOK_STORE_NAME)) {
        dbInstance.createObjectStore(BOOK_STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(MUSIC_STORE_NAME)) {
        dbInstance.createObjectStore(MUSIC_STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        dbInstance.createObjectStore(VIDEO_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Book Functions
export async function saveBook(book: BookWithContent): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([BOOK_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(BOOK_STORE_NAME);
    const request = store.put(book);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getBookContent(id: string): Promise<BookWithContent | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([BOOK_STORE_NAME], 'readonly');
    const store = transaction.objectStore(BOOK_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result as BookWithContent | undefined);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getBooksMetadata(): Promise<BookMetadata[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOK_STORE_NAME], 'readonly');
        const store = transaction.objectStore(BOOK_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const allBooks: BookWithContent[] = request.result;
            const metadata: BookMetadata[] = allBooks.map(({ id, title, type, bookmarks }) => ({ id, title, type, bookmarks }));
            resolve(metadata);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function deleteBookContent(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([BOOK_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(BOOK_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Music Functions
export async function saveTrack(track: TrackWithContent): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(MUSIC_STORE_NAME);
    const request = store.put(track);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getTrackContent(id: string): Promise<TrackWithContent | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MUSIC_STORE_NAME], 'readonly');
    const store = transaction.objectStore(MUSIC_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result as TrackWithContent | undefined);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getTracksMetadata(): Promise<TrackMetadata[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const allTracks: TrackWithContent[] = request.result;
            const metadata: TrackMetadata[] = allTracks.map(({ id, title, type, artist, album, duration, category, createdAt, order }) => ({ id, title, type, artist, album, duration, category, createdAt, order }));
            
            // Sort by the new 'order' field, with a fallback to createdAt for older data
            metadata.sort((a, b) => {
              if (a.order !== undefined && b.order !== undefined) {
                  return a.order - b.order;
              }
              if (a.order !== undefined) return -1;
              if (b.order !== undefined) return 1;

              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateA - dateB;
            });
            
            resolve(metadata);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function deleteTrack(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(MUSIC_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}


// Video Functions
export async function saveVideo(video: VideoFile): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    const request = store.put(video);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getVideos(): Promise<VideoFile[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([VIDEO_STORE_NAME], 'readonly');
        const store = transaction.objectStore(VIDEO_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result as VideoFile[]);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
