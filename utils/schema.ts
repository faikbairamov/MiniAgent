export const functions = [
  {
    name: "search",
    description: "Searches the web for a given query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "calculate",
    description: "Evaluates a math expression",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "The math expression",
        },
      },
      required: ["expression"],
    },
  },
];
