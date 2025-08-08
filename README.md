# MiniAgent

A lightweight AI agent built with TypeScript that uses Google's Gemini API to process user queries and execute custom functions. The agent implements the **ReAct (Reasoning and Acting)** pattern for intelligent problem-solving with real web searches and mathematical calculations.

## Features

- **ReAct Pattern**: Implements Reasoning → Acting → Observing cycles for intelligent problem-solving
- **AI-Powered Conversations**: Uses Google Gemini 1.5 Flash model for natural language processing
- **Function Calling**: Supports custom function execution based on user queries
- **Real Search Capability**: Wikipedia API integration with DuckDuckGo fallback
- **Mathematical Calculations**: Evaluates mathematical expressions
- **Rate Limiting**: Built-in API rate limiting to prevent quota exceeded errors
- **Error Handling**: Graceful error handling with retry logic and fallback responses
- **TypeScript**: Fully typed codebase for better development experience
- **Environment Configuration**: Secure API key management with dotenv
- **Smart Query Processing**: Multiple query variations for better search results

## Project Structure

```
MiniAgent/
├── agents/
│   └── agent.ts          # ReAct agent logic with rate limiting and error handling
├── utils/
│   └── schema.ts         # Function definitions and schemas
├── functions/
│   ├── search.ts         # Real web search implementation (Wikipedia + DuckDuckGo)
│   └── calculator.ts     # Mathematical calculation logic
├── index.ts              # Entry point and example usage
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Google Gemini API key

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd MiniAgent
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

4. Add your Google Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Getting Your API Key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Usage

### Running the Example

The project includes a simple example in `index.ts`:

```bash
npx ts-node index.ts
```

This will run the ReAct agent with a predefined prompt asking about Albert Einstein and performing a mathematical calculation.

### Using the Agent Programmatically

```typescript
import { runAgent } from "./agents/agent";

// Run the agent with your own prompt
const prompt = "Tell me about Albert Einstein and calculate 25 * 4";
await runAgent(prompt);
```

## How ReAct Works

The agent follows the **ReAct (Reasoning and Acting)** pattern:

1. **Reasoning**: The AI thinks about what it needs to do
2. **Acting**: The AI decides on specific actions to take
3. **Observing**: The AI executes actions and observes results
4. **Repeating**: The cycle continues until the problem is solved

### Example ReAct Flow

```
User: "Tell me about Albert Einstein and calculate 25 * 4"

Step 1:
💭 Thought: "I need to search for Einstein info and calculate 25 * 4"
⚡ Action: calculate
👁️ Observation: "The result of 25 * 4 is 100"

Step 2:
💭 Thought: "I have the calculation, now I need Einstein info"
⚡ Action: search
👁️ Observation: "Albert Einstein was a German-born physicist..."

Step 3:
💭 Thought: "I have both pieces of information, I can answer now"
⚡ Action: final_answer
👁️ Observation: "Complete answer combining both pieces"
```

## Available Functions

### Search Function

- **Purpose**: Performs real web searches using multiple APIs
- **Implementation**:
  - Primary: Wikipedia REST API for factual information
  - Fallback: DuckDuckGo Instant Answer API
  - Smart query variations for better results
- **Features**:
  - Real-time information from Wikipedia
  - Multiple query formats for better matching
  - Graceful error handling
  - Formatted output with emojis and structure
- **Usage**: Automatically called when the agent detects a search query

### Calculate Function

- **Purpose**: Evaluates mathematical expressions
- **Implementation**: Uses JavaScript's eval() function with error handling
- **Usage**: Automatically called when mathematical expressions are detected

## Rate Limiting & Error Handling

### Built-in Rate Limiting

- **2-second delay** between API calls to prevent rate limits
- **Automatic retry** with 30-second wait if rate limit is hit
- **Maximum 3 steps** per query to stay within free tier limits

### Error Handling

- **Graceful degradation** when APIs are unavailable
- **Fallback responses** using available information
- **Clear error messages** for debugging

## Search Examples

The search function can handle various types of queries:

- **Geographic**: "Paris", "New York City", "Tokyo"
- **People**: "Albert Einstein", "Marie Curie"
- **Concepts**: "Artificial Intelligence", "Quantum Physics"
- **Technology**: "Python programming language", "Machine Learning"

Example output:

```
Search results for "Paris":

📖 **Summary**: Paris is the capital and largest city of France. With an estimated population of 2,048,472 in January 2025...

🔗 **Source**: Wikipedia
```

## Configuration

### TypeScript Configuration

The project uses TypeScript with the following configuration in `tsconfig.json`:

- Target: ESNext
- Module: NodeNext
- Strict mode enabled
- ES Module interop enabled

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Development

### Adding New Functions

1. Create a new function file in the `functions/` directory
2. Add the function schema to `utils/schema.ts`
3. Update the agent logic in `agents/agent.ts` to handle the new function

Example function schema:

```typescript
{
  name: "your_function",
  description: "Description of what your function does",
  parameters: {
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "Parameter description",
      },
    },
    required: ["param1"],
  },
}
```

### Building the Project

```bash
# Compile TypeScript to JavaScript
npx tsc

# Run with compiled JavaScript
node index.js
```

## Dependencies

### Production Dependencies

- `@google/generative-ai`: Google's official Gemini API client
- `dotenv`: Environment variable management

### Development Dependencies

- `typescript`: TypeScript compiler and language support
- `ts-node`: TypeScript execution environment

## API Limits

This project uses the Gemini 1.5 Flash model, which is available on the free tier. Be aware of the following limits:

- **15 requests per minute** per model (free tier)
- **Rate limiting** built into the agent to prevent quota exceeded errors
- **Automatic retry** with exponential backoff

## External APIs Used

### Wikipedia REST API

- **Purpose**: Primary source for factual information
- **Cost**: Free
- **Rate Limits**: Generous limits for normal usage
- **Documentation**: [Wikipedia API](https://en.wikipedia.org/api/rest_v1/)

### DuckDuckGo Instant Answer API

- **Purpose**: Fallback search provider
- **Cost**: Free
- **Rate Limits**: No strict limits
- **Documentation**: [DuckDuckGo API](https://duckduckgo.com/api)

## Security Considerations

- Never commit your API key to version control
- The calculator function uses `eval()` - be cautious with user input
- Consider implementing input validation for production use
- Search queries are sent to external APIs - ensure privacy compliance

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your `.env` file contains the correct API key
2. **Rate Limit Error**: The agent automatically handles rate limits with delays and retries
3. **Model Not Found**: The project uses `gemini-1.5-flash` - ensure this model is available in your region
4. **Search Not Working**: Check internet connectivity and API availability

### Error Messages

- `404 Not Found`: Check if the model name is correct
- `429 Too Many Requests`: Agent automatically retries with delays
- `401 Unauthorized`: Invalid or missing API key
- `Search failed`: Check internet connection and API availability

## Recent Updates

### v1.2.0 - ReAct Implementation with Rate Limiting

- ✅ Implemented ReAct (Reasoning and Acting) pattern
- ✅ Added built-in rate limiting (2-second delays between calls)
- ✅ Automatic retry logic for rate limit errors
- ✅ Comprehensive error handling with fallback responses
- ✅ Reduced maximum steps to 3 to stay within free tier limits
- ✅ Improved logging with emojis and step-by-step visibility
- ✅ Graceful degradation when APIs are unavailable

### v1.1.0 - Real Search Implementation

- ✅ Implemented real Wikipedia API integration
- ✅ Added DuckDuckGo Instant Answer API as fallback
- ✅ Smart query variations for better results
- ✅ Comprehensive error handling
- ✅ Formatted search results with emojis
- ✅ Updated TypeScript configurations
