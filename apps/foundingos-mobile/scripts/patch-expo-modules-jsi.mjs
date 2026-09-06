import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const scriptPath = join(appRoot, 'node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh');
const needle = '    SKIP_INSTALL=NO \\\n';
const replacement = `${needle}    CODE_SIGNING_ALLOWED=NO \\\n    CODE_SIGNING_REQUIRED=NO \\\n`;

let contents = readFileSync(scriptPath, 'utf8');

if (!contents.includes('CODE_SIGNING_ALLOWED=NO')) {
  contents = contents.replace(needle, replacement);
  writeFileSync(scriptPath, contents);
  console.log('Patched expo-modules-jsi xcframework build script for local Xcode signing.');
}
