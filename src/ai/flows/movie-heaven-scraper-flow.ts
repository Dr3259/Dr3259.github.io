
'use server';
/**
 * @fileOverview A flow to scrape movie heaven (dydytt.net) for latest movies.
 *
 * - scrapeMovieHeaven - Fetches and parses the latest movies from the homepage.
 * - MovieHeavenItem - The type for a single movie entry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';

const MovieHeavenItemSchema = z.object({
  title: z.string().describe('The title of the movie.'),
  downloadUrl: z.string().url().describe('The FTP download link for the movie.'),
});
export type MovieHeavenItem = z.infer<typeof MovieHeavenItemSchema>;

const MovieHeavenOutputSchema = z.array(MovieHeavenItemSchema);
export type MovieHeavenOutput = z.infer<typeof MovieHeavenOutputSchema>;

export async function scrapeMovieHeaven(): Promise<MovieHeavenOutput> {
  return scrapeMovieHeavenFlow();
}

const scrapeMovieHeavenFlow = ai.defineFlow(
  {
    name: 'scrapeMovieHeavenFlow',
    inputSchema: z.void(),
    outputSchema: MovieHeavenOutputSchema,
  },
  async () => {
    try {
      const url = 'https://dydytt.net/index.htm';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch dydytt.net page: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const decodedHtml = iconv.decode(Buffer.from(arrayBuffer), 'gb2312');
      
      const $ = cheerio.load(decodedHtml);

      const movies: MovieHeavenItem[] = [];

      // New, more robust selector targeting the "2024新片精品" section
      const newMoviesList = $('div.co_content2').find('ul').first();

      newMoviesList.find('a').each((index, element) => {
        const linkElement = $(element);
        const movieTitle = linkElement.text().trim();
        const href = linkElement.attr('href');

        if (movieTitle && href && href.startsWith('/html/gndy/')) {
            const fullUrl = new URL(href, url).href;

            // This is a naive assumption, as we'd need another fetch to get the real download link.
            // For now, we'll just point to the page, as a placeholder for a real download link.
            // A more complex implementation would fetch the `fullUrl` and parse out the ftp:// link.
            
            movies.push({
                title: movieTitle,
                downloadUrl: fullUrl, 
            });
        }
      });
      
      const filteredMovies = movies.filter(m => m.title && !m.title.includes('更多最新电影') && !m.title.includes('更多高清电影'));
      
      if (filteredMovies.length === 0) {
        throw new Error('Could not parse any movies. The website structure may have changed.');
      }

      return filteredMovies.slice(0, 15); // Limit to a reasonable number

    } catch (error: any) {
      console.error('Error in scrapeMovieHeavenFlow:', error);
      throw new Error(error.message || 'An unknown error occurred while scraping the movie page.');
    }
  }
);
