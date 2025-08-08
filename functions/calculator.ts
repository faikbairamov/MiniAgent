export function calculate(expression: string): string {
  try {
    const result = eval(expression);
    return `The result of ${expression} is ${result}`;
  } catch {
    return "Invalid expression.";
  }
}
