
import type { ResearchTopicOutput } from "@/ai/flows/info-hub-flow";

export interface HistoryItem {
    id: string;
    topic: string;
    result: ResearchTopicOutput;
    timestamp: string;
}
