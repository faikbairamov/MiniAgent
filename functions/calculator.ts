export function calculate(expression: string): string {
  try {
    // Clean and validate the expression
    const cleanExpression = expression.trim();

    // Basic security check - only allow safe mathematical operations
    const allowedChars = /^[0-9+\-*/().\s]+$/;
    if (!allowedChars.test(cleanExpression)) {
      return "Error: Invalid characters in expression. Only numbers and basic math operators (+, -, *, /, (, )) are allowed.";
    }

    // Check for potentially dangerous operations
    if (
      cleanExpression.includes("eval") ||
      cleanExpression.includes("Function") ||
      cleanExpression.includes("constructor")
    ) {
      return "Error: Potentially unsafe expression detected.";
    }

    // Evaluate the expression
    const result = eval(cleanExpression);

    // Check if result is valid
    if (typeof result !== "number" || !isFinite(result)) {
      return "Error: Invalid calculation result.";
    }

    // Format the result
    const formattedResult = Number.isInteger(result)
      ? result.toString()
      : result.toFixed(2);

    return `The result of ${cleanExpression} is ${formattedResult}`;
  } catch (error) {
    console.error("Calculator error:", error);
    return `Error: Could not calculate "${expression}". Please check your expression and try again.`;
  }
}
