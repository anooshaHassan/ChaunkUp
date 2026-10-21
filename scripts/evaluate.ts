import { testSet, type TestMessage, type ExpectedVerdict } from "../src/lib/testSet";
import { analyzeMessage } from "../src/lib/gemini";

const CONCURRENCY = 5;

type ActualVerdict = ExpectedVerdict | "suspicious" | "error";

type TestResult = {
  id: number;
  expected: ExpectedVerdict;
  actual: ActualVerdict;
  confidence: number;
  category: string;
  language: TestMessage["language"];
  error?: string;
};

function isPassStrict(result: TestResult): boolean {
  return result.actual === result.expected;
}

function isPassLenient(result: TestResult): boolean {
  if (result.expected === "safe") return result.actual === "safe";
  return result.actual === "scam" || result.actual === "suspicious";
}

async function runTest(message: TestMessage): Promise<TestResult> {
  try {
    const analysis = await analyzeMessage(message.text);
    if (!analysis) {
      return {
        id: message.id,
        expected: message.expected,
        actual: "error",
        confidence: 0,
        category: message.category,
        language: message.language,
        error: "AI returned invalid or empty output",
      };
    }
    return {
      id: message.id,
      expected: message.expected,
      actual: analysis.verdict,
      confidence: analysis.confidence,
      category: message.category,
      language: message.language,
    };
  } catch (err) {
    return {
      id: message.id,
      expected: message.expected,
      actual: "error",
      confidence: 0,
      category: message.category,
      language: message.language,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function runInChunks<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
    if (i + limit < items.length) {
      console.log(`  ...finished ${Math.min(i + limit, items.length)} of ${items.length}`);
    }
  }
  return results;
}

function pad(value: unknown, width: number): string {
  return String(value).padEnd(width);
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    console.error("Add it to the workspace Secrets panel or export it in your shell, then run again.");
    console.error("Get a key at https://aistudio.google.com/app/apikey");
    process.exit(1);
  }

  console.log(`Running ${testSet.length} ChaunkUp test messages...\n`);

  const results = await runInChunks(testSet, CONCURRENCY, runTest);

  console.log(pad("ID", 4) + pad("Expected", 10) + pad("Actual", 12) + pad("Conf", 6) + "Result");
  console.log("-".repeat(50));

  for (const r of results) {
    const mark = isPassStrict(r) ? "✓" : isPassLenient(r) ? "~" : "✗";
    const label = isPassStrict(r) ? "PASS" : isPassLenient(r) ? "LENIENT" : "FAIL";
    console.log(
      pad(r.id, 4) +
        pad(r.expected, 10) +
        pad(r.actual, 12) +
        pad(r.confidence + "%", 6) +
        `${mark} ${label}`
    );
    if (r.error) {
      console.log(`     Error: ${r.error}`);
    }
  }

  const strictCorrect = results.filter(isPassStrict).length;
  const lenientCorrect = results.filter(isPassLenient).length;
  const strictAccuracy = ((strictCorrect / results.length) * 100).toFixed(1);
  const lenientAccuracy = ((lenientCorrect / results.length) * 100).toFixed(1);

  console.log("\n" + "=".repeat(50));
  console.log(`Total messages : ${results.length}`);
  console.log(`Strict matches : ${strictCorrect} (${strictAccuracy}%)`);
  console.log(`Lenient matches: ${lenientCorrect} (${lenientAccuracy}%)`);
  console.log(
    `Lenient counts scam+suspicious as a correct flag for scam expected, and safe as correct for genuine messages.`
  );

  const failures = results.filter((r) => !isPassLenient(r));
  if (failures.length > 0) {
    console.log("\nFailed cases (lenient):");
    for (const f of failures) {
      console.log(`  #${f.id} expected ${f.expected}, got ${f.actual} [${f.category}, ${f.language}]`);
    }
  }
}

main().catch((err) => {
  console.error("Evaluation crashed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
