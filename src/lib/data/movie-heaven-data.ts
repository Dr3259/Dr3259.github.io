
export interface MovieHeavenItem {
  title: string;
  download_links: string[];
  imdb_score?: string;
  category?: string;
  content?: string;
}

// Paste your JSON data here
export const movieHeavenData: MovieHeavenItem[] = [];
