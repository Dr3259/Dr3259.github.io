
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
      const response = await fetch(baseUrl + '/html/gndy/dyzz/index.html');
      if (!response.ok) {
        throw new Error(`Failed to fetch dydytt.net page: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const decodedHtml = iconv.decode(Buffer.from(arrayBuffer), 'gb2312');
      
      const $ = cheerio.load(decodedHtml);

      const movieDetailLinks: string[] = [];
      const newMoviesList = $('.co_content2 ul');

      newMoviesList.find('tr a').each((index, element) => {
        const linkElement = $(element);
        const href = linkElement.attr('href');
        if (href && href.startsWith('/html/gndy/')) {
            movieDetailLinks.push(new URL(href, baseUrl).href);
        }
      });
      
      const detailPromises = movieDetailLinks.slice(0, 10).map(async (detailUrl) => {
        try {
            const detailResponse = await fetch(detailUrl);
            if (!detailResponse.ok) return null;

            const detailBuffer = await detailResponse.arrayBuffer();
            const detailHtml = iconv.decode(Buffer.from(detailBuffer), 'gb2312');
            const $$ = cheerio.load(detailHtml);

            const title = $$('div.title_all h1').text().trim();
            const downloadUrl = $$('#Zoom table[bgcolor="#fdfddf"] a').attr('href');
            
            const zoomText = $$('#Zoom').text();
            
            const ratingMatch = zoomText.match(/◎豆瓣评分\s+([0-9.]+)/);
            const rating = ratingMatch ? ratingMatch[1] : undefined;

            const tagsMatch = zoomText.match(/◎类\s+别\s+([\s\S]*?)(?=\s*◎)/);
            const tags = tagsMatch ? tagsMatch[1].replace(/\s+/g, ' / ').trim() : undefined;
            
            const introMatch = zoomText.match(/◎简\s+介\s+([\s\S]*?)(?=◎|$)/);
            let shortIntro = introMatch ? introMatch[1].trim().split('\n')[0] : undefined;
            if(shortIntro && shortIntro.length > 100) {
              shortIntro = shortIntro.substring(0, 100) + '...';
            }


            if (title && downloadUrl) {
                return { title, downloadUrl, rating, tags, shortIntro };
            }
            return null;
        } catch (e) {
            console.error(`Failed to scrape detail page ${detailUrl}:`, e);
            return null;
        }
      });
      
      const results = await Promise.all(detailPromises);
      const validMovies = results.filter((m): m is MovieHeavenItem => m !== null);
      
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
