import gradient from "gradient-string";

const FULL_BANNER = [
  "  ╦╔╦╗╔═╗╦═╗╦  ╔═╗╔═╗╔═╗",
  "  ║ ║ ║╣ ╠╦╝║  ║ ║║ ║╠═╝ ",
  "  ╩ ╩ ╚═╝╩╚═╩═╝╚═╝╚═╝╩  ",
].join("\n");

const COMPACT_BANNER = "  ◈ iterloop";

// Claude orange → Gemini blue → Codex green
const iterGradient = gradient(["#F07623", "#4285F4", "#10A37F"]);

export function renderBanner(): string {
  const cols = process.stdout.columns || 80;
  const art = cols >= 50 ? FULL_BANNER : COMPACT_BANNER;
  const version = "\x1b[2m  v0.15\x1b[0m";
  const tagline = "\x1b[2m  AI-powered iterative collaboration\x1b[0m";
  const engines = "\x1b[2m  Claude \x1b[0m\x1b[38;2;240;118;35m●\x1b[0m\x1b[2m  Gemini \x1b[0m\x1b[38;2;66;133;244m●\x1b[0m\x1b[2m  Codex \x1b[0m\x1b[38;2;16;163;127m●\x1b[0m";

  return [
    "",
    iterGradient(art),
    version,
    "",
    tagline,
    engines,
    "",
  ].join("\n");
}
