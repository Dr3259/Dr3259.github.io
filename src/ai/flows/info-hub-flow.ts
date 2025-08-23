'use server';
/**
 * @fileOverview An AI agent that researches a topic online and provides a summary.
 *
 * - researchTopic - A function that handles the research process.
 * - ResearchTopicInput - The input type for the researchTopic function.
 * - ResearchTopicOutput - The return type for the researchTopic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { defineTool } from 'genkit/tool';

const ResearchTopicInputSchema = z.object({
  topic: z.string().describe('The topic for the AI to research.'),
});
export type ResearchTopicInput = z.infer<typeof ResearchTopicInputSchema>;

const ResearchTopicOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A comprehensive summary of the research findings on the given topic.'
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
const googleSearchTool = defineTool(
  {
    name: 'googleSearch',
    description: 'A tool to search Google.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => input // The tool is natively implemented, so we just return the input
);

const researchAgent = ai.definePrompt({
  name: 'researchAgentPrompt',
  input: { schema: ResearchTopicInputSchema },
  output: { schema: ResearchTopicOutputSchema },
  tools: [googleSearchTool],
  prompt: `You are a world-class research assistant. Your goal is to provide a clear, concise, and accurate summary of the requested topic, based on real-time web search results.

Topic to research: {{{topic}}}

Instructions:
1.  Perform a web search using the provided search tool to gather up-to-date information on the topic.
2.  Analyze the search results to identify the most relevant and reliable sources.
3.  Synthesize the information from these sources into a well-structured summary.
4.  List the key sources you used, providing their titles and URLs.
5.  Ensure the final output is in the specified JSON format.
`,
});

export async function researchTopic(
  input: ResearchTopicInput
): Promise<ResearchTopicOutput> {
  const { output } = await researchAgent(input);
  if (!output) {
    throw new Error('The research agent did not return a valid output.');
  }
  return output;
}
