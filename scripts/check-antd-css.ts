/**
 * Fails if src/app/antd.css is missing any rule the built pages emit inline.
 *
 * The stylesheet is generated from a hand-listed set of components
 * (scripts/extract-antd-css.ts), so adding an Ant Design component to the app without
 * adding it there would silently ship unstyled markup. This compares the generated file
 * against the inline <style> blocks in .next/server/app and reports what is missing.
 *
 * Run against a build made with ANTD_INLINE_CSS=1, which keeps the inline blocks:
 *   ANTD_INLINE_CSS=1 npm run build && npm run check:antd-css
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { globSync } from "node:fs";

const APP_DIR = resolve(import.meta.dirname, "../.next/server/app");
const CSS = resolve(import.meta.dirname, "../src/app/antd.css");

// One "rule" is a selector plus its declaration block; splitting on "}" is crude but the
// generated CSS has no nested braces outside at-rules, which are compared whole.
const rulesOf = (css: string): Set<string> =>
  new Set(
    css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split(/(?<=\})/)
      .map((r) => r.trim())
      // cssinjs emits this marker to dedupe its own cache; it styles nothing.
      .filter((r) => r.length > 0 && r !== "}" && !r.startsWith(".data-ant-cssinjs-cache-path")),
  );

const generated = rulesOf(readFileSync(CSS, "utf8"));

const files = globSync("**/*.html", { cwd: APP_DIR }).map((f) => resolve(APP_DIR, f));
if (files.length === 0) {
  console.error("check-antd-css: no built pages found — run `ANTD_INLINE_CSS=1 npm run build`");
  process.exit(1);
}

const inline = new Set<string>();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const [, body] of html.matchAll(/<style id="antd-cssinjs"[^>]*>([\s\S]*?)<\/style>/g)) {
    for (const rule of rulesOf(body)) inline.add(rule);
  }
}

if (inline.size === 0) {
  console.error("check-antd-css: built pages have no inline Ant Design styles to compare against");
  console.error("  rebuild with ANTD_INLINE_CSS=1 so the registry keeps injecting them");
  process.exit(1);
}

const missing = [...inline].filter((rule) => !generated.has(rule));

console.log(
  `check-antd-css: ${inline.size} rules across ${files.length} pages, ` +
    `${generated.size} in antd.css, ${missing.length} missing`,
);

if (missing.length > 0) {
  for (const rule of missing.slice(0, 15)) {
    console.error(`  missing: ${rule.slice(0, 140)}`);
  }
  if (missing.length > 15) console.error(`  ... and ${missing.length - 15} more`);
  console.error("\nAdd the component that owns these rules to SURFACE in extract-antd-css.ts.");
  process.exit(1);
}

console.log("check-antd-css: antd.css covers every rule the pages emit");
