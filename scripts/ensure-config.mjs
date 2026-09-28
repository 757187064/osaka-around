import { access, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptsDirectory, '..');
const localConfig = resolve(projectDirectory, 'config.local.js');
const exampleConfig = resolve(projectDirectory, 'config.example.js');

try {
  await access(localConfig);
} catch {
  await copyFile(exampleConfig, localConfig);
  console.log('Created ignored config.local.js from config.example.js.');
}
