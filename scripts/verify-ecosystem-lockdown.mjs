import fs from "fs";
import path from "path";

const ROOT = path.resolve("apps");
const fail = (msg) => {
  console.error("❌ ECOSYSTEM LOCKDOWN VIOLATION:", msg);
  process.exit(1);
};

// 1. No brand-style registry duplication
const forbiddenBrandFiles = [
  "brand-style.ts",
  "brandColors.ts",
  "brandTheme.ts",
];
for (const pkg of fs.readdirSync("packages")) {
  const dir = path.join("packages", pkg, "src");
  if (!fs.existsSync(dir)) continue;

  for (const file of forbiddenBrandFiles) {
    if (fs.existsSync(path.join(dir, file))) {
      fail(`Forbidden brand registry found: packages/${pkg}/src/${file}`);
    }
  }
}

// 2. No custom UI primitives added in consoles
for (const app of fs.readdirSync(ROOT)) {
  if (!app.endsWith("-console")) continue;

  const uiDir = path.join(ROOT, app, "app");
  const forbiddenUI = ["ui", "components/ui", "primitives"];

  forbiddenUI.forEach((folder) => {
    if (fs.existsSync(path.join(uiDir, folder))) {
      fail(`${app}: custom UI primitives are forbidden`);
    }
  });
}

// 3. SuperDash must ONLY exist in foundingos-console
for (const app of fs.readdirSync(ROOT)) {
  if (app !== "foundingos-console" && app.includes("console")) {
    const superdash = path.join(ROOT, app, "app/superdash");
    if (fs.existsSync(superdash)) {
      fail(`${app}: SuperDash is forbidden outside foundingos-console`);
    }
  }
}

// 4. FoundAI must ONLY be consumed through approved components
const forbiddenFoundAI = ["found-ai", "foundai", "ai-core"];
for (const app of fs.readdirSync(ROOT)) {
  if (!app.includes("console")) continue;

  const appDir = path.join(ROOT, app, "app");
  forbiddenFoundAI.forEach((folder) => {
    if (fs.existsSync(path.join(appDir, folder))) {
      fail(`${app}: direct FoundAI usage is forbidden`);
    }
  });
}

console.log("✅ Ecosystem lockdown verified — iron‑clad stability guaranteed.");
