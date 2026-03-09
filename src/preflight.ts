import { type EngineName, createEngine } from "./engine.js";
import { green, red, brandColor } from "./colors.js";

export interface PreflightResult {
  versions: Record<string, string>;
}

export function preflight(executor: EngineName, reviewer: EngineName): PreflightResult {
  const names = [...new Set([executor, reviewer])];
  const versions: Record<string, string> = {};
  let ok = true;

  for (const name of names) {
    const engine = createEngine(name);
    const color = brandColor(name);
    try {
      const v = engine.checkVersion();
      versions[name] = v;
      console.log(green(`  ✓ ${engine.label}`) + `  ${v}`);
    } catch {
      console.error(red(`  ✗ ${engine.label} CLI not found`));
      ok = false;
    }
  }

  if (!ok) {
    process.exit(1);
  }

  return { versions };
}
