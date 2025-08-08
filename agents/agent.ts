import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { functions } from "../utils/schema";
import { search } from "../functions/search";
import { calculate } from "../functions/calculator";

config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function runAgent(userPrompt: string) {
  const chat = model.startChat({
    history: [],
  });

  const result = await chat.sendMessage(userPrompt);

  const response = result.response;
  const toolCall = response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

  if (!toolCall) {
    console.log("Gemini says:", response.text());
    return;
  }

  const toolName = toolCall.name;
  const args = toolCall.args;

  let toolResult: string;

  if (toolName === "search") {
    toolResult = await search((args as any).query);
  } else if (toolName === "calculate") {
    toolResult = calculate((args as any).expression);
  } else {
    toolResult = "Unknown tool.";
  }

  // Continue the conversation with the tool result
  const followup = await chat.sendMessage([
    {
      text: toolResult,
    },
  ]);

  console.log("Final response:", followup.response.text());
}
