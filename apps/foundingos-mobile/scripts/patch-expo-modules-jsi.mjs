import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(dirname(appRoot));
const candidatePaths = [
  join(appRoot, 'node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh'),
  join(repoRoot, 'node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh'),
];
const scriptPath = candidatePaths.find((path) => existsSync(path));

if (!scriptPath) {
  console.log('Skipping ExpoModulesJSI signing patch: build script not found.');
  process.exit(0);
}

const marker = '    SKIP_INSTALL=NO \\\n';
const replacement = `${marker}    CODE_SIGNING_ALLOWED=NO \\\n    CODE_SIGNING_REQUIRED=NO \\\n`;
const contents = readFileSync(scriptPath, 'utf8');

if (contents.includes('CODE_SIGNING_ALLOWED=NO')) {
  process.exit(0);
}

if (!contents.includes(marker)) {
  console.log('Skipping ExpoModulesJSI signing patch: expected build-script marker not found.');
  process.exit(0);
}

writeFileSync(scriptPath, contents.replace(marker, replacement));
console.log('Patched ExpoModulesJSI local framework build to disable intermediate code signing.');
