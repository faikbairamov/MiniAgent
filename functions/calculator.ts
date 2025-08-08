export function calculate(expression: string): string {
  try {
    const result = eval(expression); // Be careful with eval!
    return `The result of ${expression} is ${result}`;
  } catch {
    return "Invalid expression.";
  }
}
