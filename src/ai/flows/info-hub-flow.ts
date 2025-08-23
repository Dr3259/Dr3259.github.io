
'use server';
/**
 * @fileOverview An AI agent that researches a topic online or summarizes a given URL.
 *
 * - researchTopic - A function that handles the research process.
 * - ResearchTopicInput - The input type for the researchTopic function.
 * - ResearchTopicOutput - The return type for the researchTopic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from 'cheerio';

const ResearchTopicInputSchema = z.object({
  topic: z.string().describe('The topic or URL for the AI to research.'),
});
export type ResearchTopicInput = z.infer<typeof ResearchTopicInputSchema>;

const ResearchTopicOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A comprehensive summary of the research findings on the given topic or URL.'
    ),
  sources: z
    .array(
      z.object({
        title: z.string().describe('The title of the source.'),
        url: z.string().url().describe('The URL of the source.'),
      })
    )
    .describe('A list of sources used for the research.'),
  metadata: z.object({
    title: z.string().optional().describe("The main title of the page or topic."),
    author: z.string().optional().describe("The author of the content, if available."),
    publishDate: z.string().optional().describe("The publication date, if available.")
  }).optional().describe("Extracted metadata from the source.")
});
export type ResearchTopicOutput = z.infer<typeof ResearchTopicOutputSchema>;

// Gemini's built-in tool for web search
const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearch',
    description: 'A tool to search Google.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => input // The tool is natively implemented, so we just return the input
);

const researchAgent = ai.defineFlow(
    {
        name: 'researchAgentFlow',
        inputSchema: ResearchTopicInputSchema,
        outputSchema: ResearchTopicOutputSchema,
    },
    async (input) => {
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        const isUrl = urlRegex.test(input.topic);

        if (isUrl) {
            try {
                const response = await fetch(input.topic, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }});
                if (!response.ok) {
                    throw new Error(`Initial fetch failed: ${response.status} ${response.statusText}. Will try search fallback.`);
                }
                const html = await response.text();
                const $ = cheerio.load(html);

                // Try to remove non-content elements to clean up the text
                $('script, style, nav, footer, header, aside, form, noscript').remove();
                
                const mainContent = $('main').text() || $('article').text() || $('body').text();
                const cleanedText = mainContent.replace(/\s\s+/g, ' ').trim();
                
                const pageTitle = $('title').text() || input.topic;

                if (!cleanedText) {
                     throw new Error("Could not extract meaningful text content from the URL. Will try search fallback.");
                }

                // If text is extracted, use a specific summarization prompt
                const { output } = await ai.generate({
                    prompt: `You are an expert summarizer. Your task is to provide a clear, concise, and accurate summary of the provided text content from a webpage. Also, extract any relevant metadata you can find.

                    Original URL: ${input.topic}
                    Page Title: ${pageTitle}
                    
                    Here is the extracted text content:
                    ---
                    ${cleanedText.substring(0, 15000)}
                    ---
                    
                    Please provide a comprehensive summary and fill in the metadata fields (author, publishDate) if you can discern them from the text.
                    `,
                    output: { schema: ResearchTopicOutputSchema },
                });

                 if (!output?.summary) {
                    throw new Error("AI failed to generate a summary for the URL content.");
                }
                
                // Ensure the URL source is correctly attributed
                if (!output.sources || output.sources.length === 0) {
                  output.sources = [{ title: pageTitle, url: input.topic }];
                } else {
                  // Make sure the original URL is in the sources if the AI found others
                  if (!output.sources.some(s => s.url === input.topic)) {
                    output.sources.unshift({ title: pageTitle, url: input.topic });
                  }
                }
                // Prepend the page title to the output metadata if it's not already there
                if (!output.metadata?.title) {
                    output.metadata = { ...output.metadata, title: pageTitle };
                }

                return output;

            } catch (error: any) {
                console.warn(`URL processing failed: ${error.message}. Falling back to web search.`);
                // Fallback to web search if direct fetching/parsing fails
                return ai.generate({
                    prompt: `I was unable to directly access the URL: ${input.topic}. Please perform a web search about this URL or its content. Summarize what it is, what it's about, and who might have created it. Provide a summary and any sources you find.`,
                    tools: [googleSearchTool],
                    output: { schema: ResearchTopicOutputSchema },
                }).then(result => {
                    if (!result.output) throw new Error('Fallback search did not return a valid output.');
                    return result.output;
                });
            }
        } else {
            // General topic research logic
            const { output } = await ai.generate({
                prompt: `You are a world-class research assistant. Your goal is to provide a clear, concise, and accurate summary of the requested topic, based on real-time web search results. The topic might be a general query or a request to find information about specific content online, such as from a WeChat Official Account or Video Channel.

                Topic to research: "${input.topic}"

                Instructions:
                1.  Perform a web search using the provided search tool to gather up-to-date information on the topic. Be creative in your search queries to find the most relevant public information.
                2.  Analyze the search results to identify the most relevant and reliable sources.
                3.  Synthesize the information from these sources into a well-structured summary.
                4.  Extract metadata like authors or dates if possible.
                5.  List the key sources you used, providing their titles and URLs.
                6.  Ensure the final output is in the specified JSON format.
                `,
                tools: [googleSearchTool],
                output: { schema: ResearchTopicOutputSchema },
            });
            if (!output) {
                throw new Error('The research agent did not return a valid output.');
            }
            if(!output.metadata?.title) {
              output.metadata = { ...output.metadata, title: input.topic };
            }
            return output;
        }
    }
);

export async function researchTopic(
  input: ResearchTopicInput
): Promise<ResearchTopicOutput> {
  return researchAgent(input);
}
