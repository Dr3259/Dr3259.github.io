
const DB_NAME = 'WeekGlanceDB';
const DB_VERSION = 1;
const BOOK_STORE_NAME = 'books';

export interface BookMetadata {
  id: string;
  title: string;
  type: 'txt' | 'pdf';
  bookmarks?: number[];
}

export interface BookWithContent extends BookMetadata {
  content: string; // Data URI
}

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(BOOK_STORE_NAME)) {
        dbInstance.createObjectStore(BOOK_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

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
