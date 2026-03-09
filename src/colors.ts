// ANSI color helpers
export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
export const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
export const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
export const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
export const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
export const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
export const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

// 256-color / brand colors
export const orange = (s: string) => `\x1b[38;2;240;118;35m${s}\x1b[0m`;   // Claude #F07623
export const gBlue = (s: string) => `\x1b[38;2;66;133;244m${s}\x1b[0m`;    // Gemini #4285F4
export const gGreen = (s: string) => `\x1b[38;2;16;163;127m${s}\x1b[0m`;   // Codex  #10A37F

// Engine brand color by name
export function brandColor(engine: string): (s: string) => string {
  switch (engine) {
    case "claude": return orange;
    case "gemini": return gBlue;
    case "codex":  return gGreen;
    default:       return cyan;
  }
}

// Strip ANSI escape sequences
export function stripAnsi(str: string): string {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    "",
  );
}
