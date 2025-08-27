
'use server';
/**
 * @fileOverview An AI agent that searches for movie information.
 *
 * - searchMovies - A function that handles the movie search process.
 * - MovieSearchInput - The input type for the searchMovies function.
 * - MovieSearchOutput - The return type for the searchMovies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MovieSearchInputSchema = z.object({
  query: z.string().describe('The movie title to search for.'),
});
export type MovieSearchInput = z.infer<typeof MovieSearchInputSchema>;

const MovieSchema = z.object({
  id: z.string().describe("A unique identifier for the movie, preferably from a known database like 'tmdb-12345'."),
  title: z.string().describe('The title of the movie.'),
  poster_path: z.string().optional().describe('The path for the movie poster image. Should be a URL fragment, not a full URL.'),
  release_date: z.string().describe('The release date of the movie, formatted as YYYY-MM-DD.'),
  overview: z.string().describe('A brief overview or synopsis of the movie.'),
});

const MovieSearchOutputSchema = z.array(MovieSchema);
export type MovieSearchOutput = z.infer<typeof MovieSearchOutputSchema>;

// Gemini's built-in tool for web search
const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearch',
    description: 'A tool to search Google for movie information.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => input // The tool is natively implemented, so we just return the input
);


const searchMoviesFlow = ai.defineFlow(
  {
    name: 'searchMoviesFlow',
    inputSchema: MovieSearchInputSchema,
    outputSchema: MovieSearchOutputSchema,
  },
  async ({ query }) => {
    const { output } = await ai.generate({
      prompt: `You are a movie database assistant. Your task is to find information about movies based on a user's query.
      
      Search for movies matching the query: "${query}"
      
      For each movie you find, provide the following information:
      - id: A unique ID, preferably from TMDB (The Movie Database), prefixed with 'tmdb-'.
      - title: The full title of the movie.
      - poster_path: The poster path from TMDB. For example, for "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", the path is "/or06FN3Dka5tukK1e9sl16pB3iy.jpg".
      - release_date: The primary release date in YYYY-MM-DD format.
      - overview: A concise summary of the movie.
      
      Return a list of up to 5 relevant movies. If you cannot find a movie, return an empty list.
      `,
      tools: [googleSearchTool],
      output: { schema: MovieSearchOutputSchema },
    });
    
    return output || [];
  }
);


export async function searchMovies(
  input: MovieSearchInput
): Promise<MovieSearchOutput> {
  return searchMoviesFlow(input);
}
