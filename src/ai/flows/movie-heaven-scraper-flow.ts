
'use server';
/**
 * @fileOverview A flow to scrape movie heaven (dydytt.net) for latest movies.
 *
 * - scrapeMovieHeaven - Fetches and parses the latest movies from the homepage with details.
 * - MovieHeavenItem - The type for a single movie entry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';

const MovieHeavenItemSchema = z.object({
  title: z.string().describe('The title of the movie.'),
  downloadUrl: z.string().url().describe('The FTP download link for the movie.'),
  rating: z.string().optional().describe('The movie rating, e.g., "8.5/10".'),
  tags: z.string().optional().describe('Comma-separated tags or genres for the movie.'),
  shortIntro: z.string().optional().describe('A short introduction to the movie.'),
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
      const baseUrl = 'https://dydytt.net';
      const listUrl = baseUrl + '/html/gndy/dyzz/index.html';
      console.log(`Fetching movie list from: ${listUrl}`);
      
      const response = await fetch(listUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch main page: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const decodedHtml = iconv.decode(Buffer.from(arrayBuffer), 'gb2312');
      
      const $ = cheerio.load(decodedHtml);

      const movieDetailLinks: string[] = [];
      $('table.tbspan tr a').each((_index, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('/html/gndy/')) {
            movieDetailLinks.push(new URL(href, baseUrl).href);
        }
      });
      
      console.log(`Found ${movieDetailLinks.length} movie links to process.`);

      if (movieDetailLinks.length === 0) {
        throw new Error("Could not find any movie links on the main page. The website structure may have changed.");
      }

      const detailPromises = movieDetailLinks.slice(0, 10).map(async (detailUrl) => {
        try {
            console.log(`Processing detail page: ${detailUrl}`);
            const detailResponse = await fetch(detailUrl);
            if (!detailResponse.ok) {
                console.error(`Failed to fetch detail page ${detailUrl}: Status ${detailResponse.status}`);
                return null;
            }

            const detailBuffer = await detailResponse.arrayBuffer();
            const detailHtml = iconv.decode(Buffer.from(detailBuffer), 'gb2312');
            const $$ = cheerio.load(detailHtml);

            const title = $$('div.title_all h1').text().trim();
            const downloadUrl = $$('#Zoom table[bgcolor="#fdfddf"] a').attr('href');
            
            if (!title || !downloadUrl) {
              console.warn(`Skipping ${detailUrl} because title or downloadUrl was not found.`);
              return null;
            }

            const zoomText = $$('#Zoom').text();
            
            const ratingMatch = zoomText.match(/◎豆瓣评分\s+([0-9.]+)/);
            const rating = ratingMatch ? ratingMatch[1] : undefined;

            const tagsMatch = zoomText.match(/◎类\s+别\s+([\s\S]*?)(?=◎|$)/);
            const tags = tagsMatch && tagsMatch[1] ? tagsMatch[1].replace(/\s+/g, ' / ').trim() : undefined;
            
            const introMatch = zoomText.match(/◎简\s+介\s+([\s\S]*?)(?=◎|$)/);
            let shortIntro = introMatch && introMatch[1] ? introMatch[1].trim().split('\n')[0] : undefined;

            if(shortIntro && shortIntro.length > 100) {
              shortIntro = shortIntro.substring(0, 100) + '...';
            }

            return { title, downloadUrl, rating, tags, shortIntro };
        } catch (e: any) {
            console.error(`Error processing detail page ${detailUrl}:`, e.message);
            return null;
        }
      });
      
      const results = await Promise.all(detailPromises);
      const validMovies = results.filter((m): m is MovieHeavenItem => m !== null);
      
      console.log(`Successfully parsed ${validMovies.length} movies.`);

      if (validMovies.length === 0) {
        throw new Error('Could not parse any movies. The website structure may have changed.');
      }

      return validMovies;

    } catch (error: any) {
      console.error('Error in scrapeMovieHeavenFlow:', error);
      throw new Error(error.message || 'An unknown error occurred while scraping the movie page.');
    }
  }
);

