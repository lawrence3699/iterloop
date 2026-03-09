import gradient from "gradient-string";
import { execFileSync } from "node:child_process";
import { orange, gBlue, gGreen, dim, bold } from "./colors.js";

// 7-line block-letter logo
const LARGE_LOGO = [
  " ██╗████████╗███████╗██████╗ ██╗      ██████╗  ██████╗ ██████╗ ",
  " ██║╚══██╔══╝██╔════╝██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗",
  " ██║   ██║   █████╗  ██████╔╝██║     ██║   ██║██║   ██║██████╔╝",
  " ██║   ██║   ██╔══╝  ██╔══██╗██║     ██║   ██║██║   ██║██╔═══╝ ",
  " ██║   ██║   ███████╗██║  ██║███████╗╚██████╔╝╚██████╔╝██║     ",
  " ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝      ",
];

const iterGradient = gradient(["#F07623", "#4285F4", "#10A37F"]);

interface EngineStatus {
  name: string;
  label: string;
  version: string | null;
  colorFn: (s: string) => string;
}

function detectEngines(): EngineStatus[] {
  const engines: { cmd: string; label: string; colorFn: (s: string) => string }[] = [
    { cmd: "claude", label: "Claude", colorFn: orange },
    { cmd: "gemini", label: "Gemini", colorFn: gBlue },
    { cmd: "codex",  label: "Codex",  colorFn: gGreen },
  ];

  return engines.map(({ cmd, label, colorFn }) => {
    let version: string | null = null;
    try {
      version = execFileSync(cmd, ["--version"], { encoding: "utf-8", timeout: 5000 }).trim();
    } catch {
      // not installed
    }
    return { name: cmd, label, version, colorFn };
  });
}

function pad(s: string, len: number): string {
  // pad with spaces, ignoring ANSI codes for length calculation
  const visible = s.replace(/\x1b\[[0-9;]*m/g, "");
  return s + " ".repeat(Math.max(0, len - visible.length));
}

export function renderBanner(): string {
  const cols = process.stdout.columns || 80;
  const engines = detectEngines();

  if (cols >= 70) {
    return renderLarge(cols, engines);
  } else {
    return renderCompact(cols, engines);
  }
}

function renderLarge(cols: number, engines: EngineStatus[]): string {
  // Determine box width from the longest logo line
  const maxLogoWidth = Math.max(...LARGE_LOGO.map((l) => l.length));
  const boxWidth = maxLogoWidth + 6; // 2 border + 4 padding
  const hBar = "═".repeat(boxWidth - 2);

  const frameLine = (content: string, visibleLen?: number) => {
    const vLen = visibleLen ?? content.replace(/\x1b\[[0-9;]*m/g, "").length;
    const padding = Math.max(0, boxWidth - 4 - vLen);
    return `  ║  ${content}${" ".repeat(padding)}║`;
  };

  const emptyLine = frameLine("", 0);

  // Pad all logo lines to the same width, then apply gradient
  const logoLines = LARGE_LOGO.map((line) => {
    const padded = line + " ".repeat(maxLogoWidth - line.length);
    const gradientLine = iterGradient(padded);
    return frameLine(gradientLine, maxLogoWidth);
  });

  // Tagline + version on same line, right-aligned version
  const tagline = "AI-powered iterative collaboration";
  const version = "v0.15";
  const taglineContent = dim(tagline);
  const versionContent = bold(version);
  const innerWidth = boxWidth - 4; // space between ║  and ║
  const tagVersionGap = Math.max(1, innerWidth - tagline.length - version.length);
  const tagVersionLine = `  ║  ${taglineContent}${" ".repeat(tagVersionGap)}${versionContent}║`;

  // Engine status lines
  const engineLines = engines.map((e) => {
    const dot = e.version ? e.colorFn("●") : dim("○");
    const label = e.version ? e.colorFn(e.label) : dim(e.label);
    const ver = e.version ? dim(` (${e.version})`) : dim(" (not found)");
    const content = `   ${dot} ${label}${ver}`;
    const visLen = 5 + e.label.length + (e.version ? ` (${e.version})`.length : " (not found)".length);
    return frameLine(content, visLen);
  });

  // Build the header label
  const engLabel = "  Engines";
  const engLabelLine = `  ║${dim(engLabel)}${" ".repeat(Math.max(0, boxWidth - 2 - engLabel.length))}║`;

  return [
    "",
    `  ╔${hBar}╗`,
    emptyLine,
    ...logoLines,
    emptyLine,
    tagVersionLine,
    emptyLine,
    `  ╠${hBar}╣`,
    emptyLine,
    ...engineLines,
    emptyLine,
    `  ╚${hBar}╝`,
    "",
  ].join("\n");
}

function renderCompact(cols: number, engines: EngineStatus[]): string {
  const boxWidth = Math.min(cols - 2, 40);
  const hBar = "═".repeat(boxWidth - 2);

  const engineDots = engines.map((e) => {
    const dot = e.version ? e.colorFn("●") : dim("○");
    return `${dot} ${e.version ? e.colorFn(e.label) : dim(e.label)}`;
  }).join("  ");

  const title = iterGradient("◈ iterloop");
  const version = bold("v0.15");

  return [
    "",
    `  ╔${hBar}╗`,
    `  ║  ${title}  ${version}${" ".repeat(Math.max(0, boxWidth - 22))}║`,
    `  ║  ${dim("AI-powered iteration")}${" ".repeat(Math.max(0, boxWidth - 24))}║`,
    `  ╠${hBar}╣`,
    `  ║  ${engineDots}${" ".repeat(Math.max(0, boxWidth - 30))}║`,
    `  ╚${hBar}╝`,
    "",
  ].join("\n");
}
