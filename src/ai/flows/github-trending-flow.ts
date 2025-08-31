
'use server';
/**
 * @fileOverview A flow to scrape the GitHub trending repositories page.
 *
 * - scrapeGitHubTrending - A function that fetches and parses the trending repositories.
 * - GithubTrendingParams - The input type for the scrapeGitHubTrending function.
 * - GithubTrendingRepo - The type for a single repository entry.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from 'cheerio';

const GithubTrendingParamsSchema = z.object({
  timespan: z.enum(['daily', 'weekly', 'monthly']).default('daily')
    .describe('The time period for which to fetch trending repositories.'),
  language: z.enum(['zh-CN', 'en']).default('en')
    .describe('The requested language for the description.'),
});
export type GithubTrendingParams = z.infer<typeof GithubTrendingParamsSchema>;

const GithubTrendingRepoSchema = z.object({
  rank: z.number().describe('The ranking of the repository.'),
  repoName: z.string().describe('The name of the repository, including the owner (e.g., "owner/repo").'),
  description: z.string().describe('The description of the repository.'),
  language: z.string().describe('The primary programming language of the repository.'),
  stars: z.string().describe('The total number of stars for the repository.'),
  starsToday: z.string().describe('The number of stars gained in the specified timespan.'),
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

const translationPrompt = ai.definePrompt({
    name: 'translateForGithubTrending',
    input: { schema: z.string() },
    output: { schema: z.string() },
    prompt: `Translate the following English text to simplified Chinese. Output only the translated text, without any introductory phrases. Preserve any emojis in the original text.
    
    English Text: "{{input}}"`,
});

const scrapeGitHubTrendingFlow = ai.defineFlow(
  {
    name: 'scrapeGitHubTrendingFlow',
    inputSchema: GithubTrendingParamsSchema,
    outputSchema: GithubTrendingOutputSchema,
  },
  async ({ timespan, language }) => {
    try {
      const url = `https://github.com/trending?since=${timespan}`;
      const response = await fetch(url, { 
        headers: { 
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        cache: 'no-store' // Disable caching for this request
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub trending page: ${response.statusText}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);

      const trendingRepos: GithubTrendingRepo[] = [];

      $('article.Box-row').each((index, element) => {
        const repoElement = $(element);
        
        const repoName = repoElement.find('h2 a').attr('href')?.substring(1).trim() || '';
        const description = repoElement.find('p').text().trim() || '';
        const language = repoElement.find('span[itemprop="programmingLanguage"]').text().trim() || 'N/A';
        
        const starElement = repoElement.find('a[href$="/stargazers"]');
        const stars = starElement.text().trim() || '0';
        
        const starsTodayElement = repoElement.find('span.d-inline-block.float-sm-right');
        const starsToday = starsTodayElement.text().trim() || '0 stars today';

        const repoUrl = `https://github.com${repoElement.find('h2 a').attr('href')}`;
        
        if (repoName) {
            trendingRepos.push({
                rank: index + 1,
                repoName,
                description,
                language,
                stars,
                starsToday: starsToday.split(' ')[0], // Extract just the number
                url: repoUrl,
            });
        }
      });
      
      if (trendingRepos.length === 0) {
        throw new Error('Could not parse any repositories from the GitHub trending page. The website structure may have changed.');
      }
      
      let finalRepos = trendingRepos;

      // Apply translation if language is Chinese
      if (language === 'zh-CN') {
         const translationPromises = finalRepos.map(async (repo) => {
            if (typeof repo.description === 'string' && repo.description.trim() !== '') {
                const response = await translationPrompt(repo.description);
                if (response.text) {
                    return { ...repo, description: response.text };
                }
            }
            return repo;
        });
        finalRepos = await Promise.all(translationPromises);
      }

      // Slice the results based on the timespan
      if (timespan === 'daily') {
        return finalRepos.slice(0, 20);
      } else if (timespan === 'weekly') {
        return finalRepos.slice(0, 15);
      } else { // monthly
        return finalRepos.slice(0, 10);
      }

    } catch (error: any) {
      console.error('Error in scrapeGitHubTrendingFlow:', error);
      throw new Error(error.message || 'An unknown error occurred while scraping the GitHub trending page.');
    }
  }
);
