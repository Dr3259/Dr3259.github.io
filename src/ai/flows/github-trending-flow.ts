
'use server';
/**
 * @fileOverview A flow to get GitHub trending repositories using AI-powered search.
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


const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearch',
    description: 'A tool to search Google for current information.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => input // The tool is natively implemented, so we just return the input
);

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
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are a GitHub trend analyst. Your task is to find the top trending repositories on GitHub for the specified time period.
        
        Timespan: ${timespan}

        Use your search tool to find the most popular and actively developing repositories on GitHub right now. 
        For each repository, provide the following information:
        - rank: The numerical rank.
        - repoName: The full name, including owner (e.g., 'vercel/next.js').
        - description: A concise summary of the repository.
        - language: The primary programming language. If not specified, use 'N/A'.
        - stars: The total star count, formatted as a string (e.g., '123k').
        - starsToday: The stars gained in the specified timespan, as a full string (e.g., '500 stars today' or '1.2k stars this week').
        - url: The full URL to the repository on GitHub.

        Return a list of the top 20 trending repositories. Ensure the data is accurate and up-to-date.
        `,
        tools: [googleSearchTool],
        output: { schema: GithubTrendingOutputSchema },
      });
      
      if (!output || output.length === 0) {
        console.warn('AI search for GitHub trending returned no results.');
        return []; // Return an empty array instead of throwing an error to prevent page crash.
      }

      return output;

    } catch (error: any) {
      console.error('Error in scrapeGitHubTrendingFlow (AI Search):', error);
      // Instead of throwing, which crashes the server component, we return an empty array.
      // The frontend will then display a "no data" message.
      return [];
    }
  }
);
