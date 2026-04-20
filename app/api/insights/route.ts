import { NextRequest, NextResponse } from "next/server";

type BudgetSummary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, number>;
  transactionCount: number;
  dateRange: { earliest: string; latest: string } | null;
};

export async function POST(req: NextRequest) {
  const summary: BudgetSummary = await req.json();

  const categoryLines = Object.entries(summary.byCategory)
    .map(([cat, amt]) => `  - ${cat}: $${amt.toFixed(2)}`)
    .join("\n");

  const period = summary.dateRange
    ? `${summary.dateRange.earliest} to ${summary.dateRange.latest}`
    : "unknown period";

  const prompt = `You are a helpful personal finance assistant. Here is a summary of a user's budget:

- Total Income: $${summary.totalIncome.toFixed(2)}
- Total Expenses: $${summary.totalExpenses.toFixed(2)}
- Balance: $${summary.balance.toFixed(2)}
- Transactions: ${summary.transactionCount}
- Period: ${period}
- Spending by category:
${categoryLines || "  - No categories available"}

Give a short, friendly 3–5 sentence summary of their financial health based on this data, and include one or two practical suggestions. Be specific to the numbers provided.`;

  let ollamaRes: Response;
  try {
    ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemma", prompt, stream: false }),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Ollama. Make sure it is running on localhost:11434." },
      { status: 503 }
    );
  }

  if (!ollamaRes.ok) {
    return NextResponse.json(
      { error: `Ollama returned an error: ${ollamaRes.statusText}` },
      { status: ollamaRes.status }
    );
  }

  const data = await ollamaRes.json();
  return NextResponse.json({ insight: data.response });
}
