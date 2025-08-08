export const functions = [
  {
    functionDeclarations: [
      {
        name: "search",
        description: "Searches the web for a given query",
        parameters: {
          type: "object" as const,
          properties: {
            query: {
              type: "string" as const,
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
          type: "object" as const,
          properties: {
            expression: {
              type: "string" as const,
              description: "The math expression",
            },
          },
          required: ["expression"],
        },
      },
    ],
  },
];
