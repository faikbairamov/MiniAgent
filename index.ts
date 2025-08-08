import { runAgent } from "./agents/agent";

// Example queries that demonstrate the ReAct agent's capabilities
const examples = [
  "Tell me about Albert Einstein and calculate 25 * 4",
  "What is the capital of France and what is 15 * 8?",
  "Search for information about quantum physics and calculate 100 / 4",
];

// Run the first example
const prompt =
  examples[0] || "Tell me about Albert Einstein and calculate 25 * 4";
console.log("🚀 Starting MiniAgent with ReAct Pattern...\n");
runAgent(prompt);
