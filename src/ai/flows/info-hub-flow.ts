
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

// Define a Zod schema for a simple text input for summarization
const summarizeTextSchema = z.object({
  text: z.string().describe("The text to be summarized."),
});

// A prompt specifically for summarizing provided text content
const summarizationPrompt = ai.definePrompt({
    name: 'summarizationPrompt',
    input: { schema: summarizeTextSchema },
    output: { schema: z.object({ summary: z.string().describe("A concise summary of the provided text.") }) },
    prompt: `Please provide a clear and concise summary of the following text content:\n\n---\n\n{{{text}}}\n\n---\n\n`,
});

const researchAgent = ai.defineFlow(
    {
        name: 'researchAgentFlow',
        inputSchema: ResearchTopicInputSchema,
        outputSchema: ResearchTopicOutputSchema,
    },
    async (input) => {
        // Simple URL regex to check if the topic is a URL
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        const isUrl = urlRegex.test(input.topic);

        if (isUrl) {
            // URL Processing Logic
            try {
                const response = await fetch(input.topic);
                if (!response.ok) {
                    throw new Error(`Failed to fetch URL: ${response.statusText}`);
                }
                const html = await response.text();
                const $ = cheerio.load(html);

                // Remove script, style, and other non-content tags
                $('script, style, nav, footer, header, aside, form').remove();
                
                // Extract text from the body, attempting to get meaningful content
                const mainContent = $('main').text() || $('article').text() || $('body').text();
                const cleanedText = mainContent.replace(/\s\s+/g, ' ').trim();
                
                if (!cleanedText) {
                    throw new Error("Could not extract meaningful text content from the URL.");
                }

                // Use the summarization prompt
                const { output } = await summarizationPrompt({ text: cleanedText });
                if (!output?.summary) {
                    throw new Error("AI failed to generate a summary for the URL content.");
                }

                return {
                    summary: output.summary,
                    sources: [{ title: $('title').text() || input.topic, url: input.topic }],
                };

            } catch (error: any) {
                console.error('Error processing URL:', error);
                throw new Error(`Failed to process the provided URL. ${error.message}`);
            }
        } else {
            // Existing Topic Research Logic
            const { output } = await ai.generate({
                prompt: `You are a world-class research assistant. Your goal is to provide a clear, concise, and accurate summary of the requested topic, based on real-time web search results. The topic might be a general query or a request to find information about specific content online, such as from a WeChat Official Account or Video Channel.

                Topic to research: ${input.topic}

                Instructions:
                1.  Perform a web search using the provided search tool to gather up-to-date information on the topic. Be creative in your search queries to find the most relevant public information.
                2.  Analyze the search results to identify the most relevant and reliable sources.
                3.  Synthesize the information from these sources into a well-structured summary.
                4.  List the key sources you used, providing their titles and URLs.
                5.  Ensure the final output is in the specified JSON format.
                `,
                tools: [googleSearchTool],
                output: { schema: ResearchTopicOutputSchema },
            });
            if (!output) {
                throw new Error('The research agent did not return a valid output.');
            }
            return output;
        }
    }
);

export async function researchTopic(
  input: ResearchTopicInput
): Promise<ResearchTopicOutput> {
  // We directly call the flow now
  return researchAgent(input);
}
