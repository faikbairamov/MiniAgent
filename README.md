# MiniAgent

A lightweight AI agent built with TypeScript that uses Google's Gemini API to process user queries and execute custom functions. The agent can perform web searches and mathematical calculations through a conversational interface.

## Features

- **AI-Powered Conversations**: Uses Google Gemini 1.5 Flash model for natural language processing
- **Function Calling**: Supports custom function execution based on user queries
- **Search Capability**: Web search functionality (currently mocked)
- **Mathematical Calculations**: Evaluates mathematical expressions
- **TypeScript**: Fully typed codebase for better development experience
- **Environment Configuration**: Secure API key management with dotenv

## Project Structure

```
MiniAgent/
├── agents/
│   └── agent.ts          # Main agent logic and Gemini API integration
├── utils/
│   └── schema.ts         # Function definitions and schemas
├── functions/
│   ├── search.ts         # Web search implementation
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

This will run the agent with a predefined prompt asking about the capital of France and a mathematical calculation.

### Using the Agent Programmatically

```typescript
import { runAgent } from "./agents/agent";

// Run the agent with your own prompt
const prompt = "What is the weather like today and calculate 15 * 8?";
await runAgent(prompt);
```

## How It Works

1. **User Input**: The agent receives a natural language prompt
2. **AI Processing**: Gemini analyzes the prompt and determines if any functions need to be called
3. **Function Execution**: If functions are needed, the agent calls the appropriate functions (search or calculate)
4. **Response Generation**: The agent combines the function results with AI-generated responses
5. **Output**: The final response is returned to the user

## Available Functions

### Search Function

- **Purpose**: Performs web searches
- **Current Status**: Mocked implementation
- **Usage**: Automatically called when the agent detects a search query

### Calculate Function

- **Purpose**: Evaluates mathematical expressions
- **Implementation**: Uses JavaScript's eval() function
- **Usage**: Automatically called when mathematical expressions are detected

## Configuration

### TypeScript Configuration

The project uses TypeScript with the following configuration in `tsconfig.json`:

- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps for debugging

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

- Rate limits per minute and per day
- Token limits per request
- Model availability and response times

## Security Considerations

- Never commit your API key to version control
- The calculator function uses `eval()` - be cautious with user input
- Consider implementing input validation for production use

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your `.env` file contains the correct API key
2. **Rate Limit Error**: Wait before making additional requests or upgrade your API plan
3. **Model Not Found**: The project uses `gemini-1.5-flash` - ensure this model is available in your region

### Error Messages

- `404 Not Found`: Check if the model name is correct
- `429 Too Many Requests`: You've exceeded your API quota
- `401 Unauthorized`: Invalid or missing API key

## License

ISC License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues related to:

- Google Gemini API: Visit [Google AI Studio Documentation](https://ai.google.dev/docs)
- This project: Create an issue in the repository
