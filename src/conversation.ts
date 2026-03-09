import { type Engine, type RunOptions } from "./engine.js";
import { brandColor, bold, dim, yellow } from "./colors.js";
import { promptUser } from "./input.js";

export interface Message {
  role: "user" | "executor";
  content: string;
}

export interface ConversationResult {
  messages: Message[];
  finalOutput: string;
}

function buildPrompt(messages: Message[], engineLabel: string): string {
  return messages.map((m) => {
    if (m.role === "user") {
      return `## User\n${m.content}`;
    }
    return `## ${engineLabel}\n${m.content}`;
  }).join("\n\n");
}

function displayOutput(engine: Engine, output: string): void {
  const color = brandColor(engine.name);
  const header = color(`  ┌─ ■ ${engine.label} (executor) ${"─".repeat(Math.max(0, 44 - engine.label.length))}┐`);
  const footer = color(`  └${"─".repeat(52)}┘`);

  console.log(header);
  console.log(color("  │"));
  for (const line of output.split("\n")) {
    console.log(color("  │") + `  ${line}`);
  }
  console.log(color("  │"));
  console.log(footer);
}

export async function runConversation(
  engine: Engine,
  initialPrompt: string,
  opts: RunOptions,
): Promise<ConversationResult> {
  const messages: Message[] = [];
  messages.push({ role: "user", content: initialPrompt });

  console.log(dim("  Type /done to submit for review, /cancel to abort\n"));

  while (true) {
    // Send full conversation history to executor
    const prompt = buildPrompt(messages, engine.label);

    const color = brandColor(engine.name);
    console.log(color(bold(`\n  ▶ ${engine.label} is working...\n`)));

    const output = await engine.run(prompt, opts);
    messages.push({ role: "executor", content: output });

    displayOutput(engine, output);

    // Prompt user for next message
    const userInput = await promptUser("/done to submit · /cancel to abort");

    if (userInput === "/done" || userInput === "") {
      break;
    }
    if (userInput === "/cancel") {
      throw new Error("Cancelled by user");
    }

    messages.push({ role: "user", content: userInput });
  }

  const finalOutput = messages.filter((m) => m.role === "executor").pop()?.content ?? "";
  return { messages, finalOutput };
}
