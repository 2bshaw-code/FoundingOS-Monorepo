import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// This patch only matters for local iOS/Xcode builds (it disables code
// signing requirements in expo-modules-jsi's xcframework build script). It
// must never fail `npm install` — npm workspace hoisting can place
// expo-modules-jsi in this app's own node_modules, the monorepo root's
// node_modules, or (on non-macOS installs, or older/newer expo-modules-jsi
// versions) not include this file at all. Any of those are fine; skip
// silently rather than throwing and aborting the whole install.
const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(dirname(appRoot));
const candidatePaths = [
  join(appRoot, 'node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh'),
  join(repoRoot, 'node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh'),
];

const scriptPath = candidatePaths.find((path) => existsSync(path));

if (!scriptPath) {
  console.log(
    'Skipping expo-modules-jsi xcframework patch: build-xcframework.sh not found ' +
      '(expected on non-macOS installs or with a different expo-modules-jsi version). ' +
      'This only affects local iOS/Xcode builds, not `npm install`, demo builds, or Android.',
  );
  process.exit(0);
}

const needle = '    SKIP_INSTALL=NO \\\n';
const replacement = `${needle}    CODE_SIGNING_ALLOWED=NO \\\n    CODE_SIGNING_REQUIRED=NO \\\n`;

try {
  let contents = readFileSync(scriptPath, 'utf8');

  if (!contents.includes('CODE_SIGNING_ALLOWED=NO')) {
    if (contents.includes(needle)) {
      contents = contents.replace(needle, replacement);
      writeFileSync(scriptPath, contents);
      console.log('Patched expo-modules-jsi xcframework build script for local Xcode signing.');
    } else {
      console.log(
        'Skipping expo-modules-jsi xcframework patch: expected marker not found in ' +
          'build-xcframework.sh (script contents differ from the version this patch targets).',
      );
    }
  }
} catch (error) {
  // Never fail the whole workspace install over an optional iOS-signing patch.
  console.log(`Skipping expo-modules-jsi xcframework patch: ${error.message}`);
}
