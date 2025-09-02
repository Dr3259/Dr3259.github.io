
'use server';
/**
 * @fileOverview A flow to get GitHub trending repositories using AI-powered search.
 * This file defines the Genkit flow for scraping GitHub's trending page.
 * It uses an AI model with search capabilities to find and parse repository information,
 * providing a structured output of the top trending projects.
 *
 * @exports scrapeGitHubTrending - The main function to trigger the flow.
 * @exports GithubTrendingParams - The Zod schema type for the input parameters.
 * @exports GithubTrendingRepo - The Zod schema type for a single repository object.
 * @exports GithubTrendingOutput - The Zod schema type for the array of repositories returned by the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GithubTrendingParamsSchema = z.object({
  timespan: z.enum(['daily', 'weekly', 'monthly']).default('daily')
    .describe('The time period for which to fetch trending repositories.'),
});
export type GithubTrendingParams = z.infer<typeof GithubTrendingParamsSchema>;

const GithubTrendingRepoSchema = z.object({
  rank: z.number().describe('The numerical rank of the repository on the trending list.'),
  repoName: z.string().describe('The full name of the repository, including the owner (e.g., "owner/repo").'),
  description: z.string().describe('A brief, one-sentence description of the repository.'),
  language: z.string().describe('The primary programming language used in the repository.'),
  stars: z.string().describe('The total number of stars the repository has, formatted as a string (e.g., "123k").'),
  starsToday: z.string().describe('The number of new stars gained within the specified timespan (e.g., "123 stars today").'),
  url: z.string().url().describe('The full GitHub URL for the repository.'),
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

/**
 * An exported wrapper function that directly calls the scrapeGitHubTrendingFlow.
 * This provides a clean, callable interface for server components.
 * @param {GithubTrendingParams} input - The parameters for fetching trending data, primarily the timespan.
 * @returns {Promise<GithubTrendingOutput>} A promise that resolves to an array of trending repositories.
 */
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
        return []; // Return an empty array instead of throwing an error to prevent page crash.
      }

      return output;

    } catch (error: any) {
      // Instead of throwing, which crashes the server component, we return an empty array.
      // The frontend will then display a "no data" message.
      return [];
    }
  }
);
