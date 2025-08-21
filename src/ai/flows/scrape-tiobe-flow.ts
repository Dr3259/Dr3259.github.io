
'use server';
/**
 * @fileOverview A flow to scrape the TIOBE index from their website.
 *
 * - scrapeTiobe - A function that fetches and parses the TIOBE index page.
 * - TiobeIndexEntry - The type for a single entry in the TIOBE rankings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';
import * as cheerio from 'cheerio';

const TiobeIndexEntrySchema = z.object({
  rank: z.number().describe('The current ranking of the programming language.'),
  language: z.string().describe('The name of the programming language.'),
  rating: z.string().describe('The rating percentage of the language.'),
});
export type TiobeIndexEntry = z.infer<typeof TiobeIndexEntrySchema>;

const TiobeIndexOutputSchema = z.array(TiobeIndexEntrySchema);
export type TiobeIndexOutput = z.infer<typeof TiobeIndexOutputSchema>;

export async function scrapeTiobe(): Promise<TiobeIndexOutput> {
  return scrapeTiobeFlow();
}

const scrapeTiobeFlow = ai.defineFlow(
  {
    name: 'scrapeTiobeFlow',
    inputSchema: z.void(),
    outputSchema: TiobeIndexOutputSchema,
  },
  async () => {
    try {
      const response = await fetch('https://www.tiobe.com/tiobe-index/');
      if (!response.ok) {
        throw new Error(`Failed to fetch TIOBE index page: ${response.statusText}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);

      const rankings: TiobeIndexEntry[] = [];

      $('#top20 tbody tr').each((_index, element) => {
        const columns = $(element).find('td');
        if (columns.length >= 4) { // Ensure there are enough columns
          const rank = parseInt($(columns[0]).text().trim(), 10);
          const language = $(columns[3]).text().trim();
          const rating = $(columns[4]).text().trim();

          if (!isNaN(rank) && language) {
            rankings.push({ rank, language, rating });
          }
        }
      });
      
      if (rankings.length === 0) {
        // This could happen if the table structure changes.
        throw new Error('Could not parse any rankings from the TIOBE index page. The website structure may have changed.');
      }

      return rankings;

    } catch (error: any) {
      console.error('Error in scrapeTiobeFlow:', error);
      // Re-throw the error so the frontend can catch it and display a message.
      throw new Error(error.message || 'An unknown error occurred while scraping the TIOBE index.');
    }
  }
);
