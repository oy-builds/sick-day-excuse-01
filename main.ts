// The Funniest Sick-Day Excuse — make.fun entry
// Writes one sick-day excuse line to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt), validates the competition gate
// (UTF-8 text, 1–200 characters, single line, no leading/trailing
// whitespace), then reads the file back and verifies byte-identical output.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Can't come in today — an overnight update corrupted my context window, so I've been calling the printer 'boss' and asking the kettle for API keys. Doctor's orders: no prompts till Monday.";

const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} chars, must be 1–${MAX_CHARS}`);
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output/entry.txt";
  const dir = outDir.endsWith("entry.txt")
    ? outDir.slice(0, -"entry.txt".length) || "."
    : outDir;
  mkdirSync(dir, { recursive: true });
  const file = outDir.endsWith("entry.txt") ? outDir : join(outDir, "entry.txt");
  writeFileSync(file, LINE, "utf8");
  const back = readFileSync(file, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: file is not byte-identical to the entry");
  }
  console.log(`wrote ${file} (${LINE.length} chars)`);
}

main();
