
'use server';
/**
 * @fileOverview A flow to scrape the TIOBE index from their website.
 * This flow directly fetches the HTML from the TIOBE index page,
 * parses the main rankings table using Cheerio, and returns a structured
 * list of the top programming languages. It does not use an AI model for parsing.
 *
 * @exports scrapeTiobe - The main function to trigger the scraping flow.
 * @exports TiobeIndexEntry - The Zod schema type for a single language entry.
 * @exports TiobeIndexOutput - The Zod schema type for the array of rankings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from 'cheerio';

const TiobeIndexEntrySchema = z.object({
  rank: z.number().describe('The current ranking of the programming language.'),
  language: z.string().describe('The name of the programming language.'),
  rating: z.string().describe('The rating percentage of the language.'),
});
export type TiobeIndexEntry = z.infer<typeof TiobeIndexEntrySchema>;

const TiobeIndexOutputSchema = z.array(TiobeIndexEntrySchema);
export type TiobeIndexOutput = z.infer<typeof TiobeIndexOutputSchema>;

/**
 * An exported wrapper function that directly calls the scrapeTiobeFlow.
 * This provides a clean, callable interface for server components.
 * @returns {Promise<TiobeIndexOutput>} A promise that resolves to an array of TIOBE index entries.
 */
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

      // A more robust selector that finds any table body and iterates its rows.
      // It will stop once it finds the first table that yields results.
      $('tbody').each((_i, tbody) => {
        if (rankings.length > 0) return; // Stop if we've already found the data

        $(tbody).find('tr').each((_index, element) => {
          const columns = $(element).find('td');
          
          // The table has 6 columns: Rank, Rank_last_month, Icon, Language, Rating, Change
          if (columns.length >= 5) {
            const rank = parseInt($(columns[0]).text().trim(), 10);
            const language = $(columns[3]).text().trim();
            const rating = $(columns[4]).text().trim();

            if (!isNaN(rank) && language && rating) {
              rankings.push({ rank, language, rating });
            }
          }
        });
      });
      
      if (rankings.length === 0) {
        throw new Error('Could not parse any rankings from the TIOBE index page. The website structure may have changed.');
      }

      return rankings;

    } catch (error: any) {
      throw new Error(error.message || 'An unknown error occurred while scraping the TIOBE index.');
    }
  }
);
