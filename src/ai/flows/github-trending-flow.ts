
'use server';
/**
 * @fileOverview A flow to scrape the GitHub trending repositories page using AI.
 *
 * - scrapeGitHubTrending - A function that fetches and parses the trending repositories.
 * - GithubTrendingParams - The input type for the scrapeGitHubTrending function.
 * - GithubTrendingRepo - The type for a single repository entry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GithubTrendingParamsSchema = z.object({
  timespan: z.enum(['daily', 'weekly', 'monthly']).default('daily')
    .describe('The time period for which to fetch trending repositories.'),
});
export type GithubTrendingParams = z.infer<typeof GithubTrendingParamsSchema>;

const GithubTrendingRepoSchema = z.object({
  rank: z.number().describe('The ranking of the repository.'),
  repoName: z.string().describe('The name of the repository, including the owner (e.g., "owner/repo").'),
  description: z.string().describe('The description of the repository.'),
  language: z.string().describe('The primary programming language of the repository.'),
  stars: z.string().describe('The total number of stars for the repository.'),
  starsToday: z.string().describe('The number of stars gained in the specified timespan (e.g., "123 stars today").'),
  url: z.string().url().describe('The URL of the repository.'),
});
export type GithubTrendingRepo = z.infer<typeof GithubTrendingRepoSchema>;

const GithubTrendingOutputSchema = z.array(GithubTrendingRepoSchema);
export type GithubTrendingOutput = z.infer<typeof GithubTrendingOutputSchema>;

export async function scrapeGitHubTrending(
  input: GithubTrendingParams
): Promise<GithubTrendingOutput> {
  return scrapeGitHubTrendingFlow(input);
}

const scrapeGitHubTrendingFlow = ai.defineFlow(
  {
    name: 'scrapeGitHubTrendingFlow',
    inputSchema: GithubTrendingParamsSchema,
    outputSchema: GithubTrendingOutputSchema,
  },
  async ({ timespan }) => {
    try {
      const url = `https://github.com/trending?since=${timespan}`;
      const response = await fetch(url, { 
        headers: { 
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub trending page: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();

      if (!html) {
          throw new Error('Fetched HTML content is empty.');
      }

      // Use AI to parse the HTML content
      const { output } = await ai.generate({
        prompt: `You are an expert at parsing HTML. Please extract the trending repository information from the following HTML content. 
        The content is from the GitHub Trending page for the '${timespan}' timespan.
        For each repository, extract the rank, full repository name (owner/repo), description, programming language, total stars, and the number of stars gained in the current timespan.
        The URL should be the full URL to the repository.
        If a field is not present, provide a sensible default like 'N/A' or an empty string for the description.
        The stars today should be the full string like "123 stars today".

        HTML Content:
        \`\`\`html
        ${html}
        \`\`\`
        `,
        output: { schema: GithubTrendingOutputSchema },
      });
      
      if (!output || output.length === 0) {
        throw new Error('AI parsing failed to extract any repositories. The GitHub page structure might have significantly changed or the fetched content was invalid.');
      }

      return output;

    } catch (error: any) {
      console.error('Error in scrapeGitHubTrendingFlow:', error);
      throw new Error(error.message || 'An unknown error occurred while scraping the GitHub trending page.');
    }
  }
);
