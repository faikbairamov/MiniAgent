import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { functions } from "../utils/schema";
import { search } from "../functions/search";
import { calculate } from "../functions/calculator";

config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface ReActStep {
  thought: string;
  action: string;
  actionInput?: any;
  observation: string;
}

// Rate limiting helper
let lastApiCall = 0;
const MIN_DELAY_BETWEEN_CALLS = 2000; // 2 seconds between calls

async function rateLimitedApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;

  if (timeSinceLastCall < MIN_DELAY_BETWEEN_CALLS) {
    const delay = MIN_DELAY_BETWEEN_CALLS - timeSinceLastCall;
    console.log(`⏳ Rate limiting: waiting ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastApiCall = Date.now();

  try {
    return await apiCall();
  } catch (error: any) {
    if (error.status === 429) {
      console.log("🔄 Rate limit hit, waiting 30 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 30000));
      return await apiCall(); // Retry once
    }
    throw error;
  }
}

export async function runAgent(userPrompt: string) {
  const chat = model.startChat({
    history: [],
  });

  console.log("🤖 MiniAgent (ReAct Mode) Starting...\n");
  console.log(`📝 User Question: "${userPrompt}"\n`);

  const maxSteps = 3; // Reduced to prevent rate limits
  let currentStep = 0;
  const steps: ReActStep[] = [];

  try {
    while (currentStep < maxSteps) {
      currentStep++;
      console.log(`🔄 Step ${currentStep}:`);

      // 1. REASONING: Think about what to do next
      const reasoningPrompt = buildReasoningPrompt(userPrompt, steps);
      const reasoningResult = await rateLimitedApiCall(() =>
        chat.sendMessage(reasoningPrompt)
      );
      const thought = reasoningResult.response.text();

      console.log(`💭 Thought: ${thought}`);

      // 2. ACTING: Decide on an action
      const actionPrompt = buildActionPrompt(thought, steps);
      const actionResult = await rateLimitedApiCall(() =>
        chat.sendMessage(actionPrompt)
      );
      const actionResponse = actionResult.response.text();

      // Parse the action from the response
      const actionMatch = actionResponse.match(
        /ACTION:\s*(search|calculate|final_answer|none)/i
      );
      const action = actionMatch?.[1]?.toLowerCase() || "none";
      
      console.log(`⚡ Action: ${action}`);

      // 3. OBSERVING: Execute the action and observe results
      let observation = "";
      
      if (action === "search") {
        const queryMatch = actionResponse.match(/QUERY:\s*(.+)/i);
        if (queryMatch?.[1]) {
          const query = queryMatch[1].trim();
          console.log(`🔍 Searching for: "${query}"`);
          observation = await search(query);
        } else {
          observation = "Error: No search query specified";
        }
      } else if (action === "calculate") {
        const expressionMatch = actionResponse.match(/EXPRESSION:\s*(.+)/i);
        if (expressionMatch?.[1]) {
          const expression = expressionMatch[1].trim();
          console.log(`🧮 Calculating: "${expression}"`);
          observation = calculate(expression);
        } else {
          observation = "Error: No expression specified";
        }
      } else if (action === "final_answer") {
        const answerMatch = actionResponse.match(/ANSWER:\s*(.+)/i);
        if (answerMatch?.[1]) {
          observation = answerMatch[1].trim();
          console.log(`✅ Final Answer: ${observation}`);
          break; // Exit the loop
        }
      } else {
        observation = "No action taken";
      }

      console.log(
        `👁️ Observation: ${observation.substring(0, 100)}${
          observation.length > 100 ? "..." : ""
        }\n`
      );

      // Store the step
      steps.push({
        thought,
        action,
        actionInput:
          action === "search"
            ? actionResponse.match(/QUERY:\s*(.+)/i)?.[1]
            : action === "calculate"
            ? actionResponse.match(/EXPRESSION:\s*(.+)/i)?.[1]
            : undefined,
        observation,
      });

      // Check if we should continue or stop
      if (action === "final_answer" || action === "none") {
        break;
      }
    }

    // Generate final response
    const finalPrompt = buildFinalPrompt(userPrompt, steps);
    const finalResult = await rateLimitedApiCall(() =>
      chat.sendMessage(finalPrompt)
    );

    console.log("\n🎯 Final Response:");
    console.log("=".repeat(50));
    console.log(finalResult.response.text());
    console.log("=".repeat(50));
  } catch (error: any) {
    console.error("\n❌ Error occurred:");
    if (error.status === 429) {
      console.log("Rate limit exceeded. Please wait a minute and try again.");
    } else {
      console.log(`Error: ${error.message}`);
    }

    // Provide a fallback response based on what we have
    if (steps.length > 0) {
      console.log("\n🔄 Fallback Response:");
      console.log("=".repeat(50));
      console.log("Based on the information gathered:");
      steps.forEach((step, index) => {
        if (step.action === "calculate") {
          console.log(`• ${step.observation}`);
        }
      });
      console.log("=".repeat(50));
    }
  }
}

function buildReasoningPrompt(userPrompt: string, steps: ReActStep[]): string {
  let prompt = `You are a ReAct (Reasoning and Acting) agent. Your goal is to help the user with their question: "${userPrompt}"

Available tools:
- search: Look up information on the web
- calculate: Perform mathematical calculations
- final_answer: Provide the final answer to the user

Previous steps:`;

  steps.forEach((step, index) => {
    prompt += `\nStep ${index + 1}:
- Thought: ${step.thought}
- Action: ${step.action}
- Observation: ${step.observation}`;
  });

  prompt += `\n\nNow, think about what you need to do next. Consider:
1. What information do you still need?
2. What actions would be most helpful?
3. Do you have enough information to answer the user's question?

Provide your reasoning:`;

  return prompt;
}

function buildActionPrompt(thought: string, steps: ReActStep[]): string {
  return `Based on your reasoning: "${thought}"

Decide on your next action. Respond in this exact format:

If you need to search:
ACTION: search
QUERY: [your search query]

If you need to calculate:
ACTION: calculate
EXPRESSION: [mathematical expression]

If you have enough information to answer:
ACTION: final_answer
ANSWER: [your complete answer to the user's question]

If you don't need to do anything:
ACTION: none

What is your action?`;
}

function buildFinalPrompt(userPrompt: string, steps: ReActStep[]): string {
  let prompt = `Based on all the steps taken, provide a comprehensive answer to: "${userPrompt}"

Steps taken:`;

  steps.forEach((step, index) => {
    prompt += `\nStep ${index + 1}:
- Thought: ${step.thought}
- Action: ${step.action}
- Observation: ${step.observation}`;
  });

  prompt += `\n\nProvide a clear, comprehensive answer that addresses the user's question using all the information gathered.`;

  return prompt;
}
