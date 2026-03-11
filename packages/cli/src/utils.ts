import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface CliOptions {
  name: string;
  output: string;
  url: string;
  email: string;
  framework: string;
  appType: string;
  auth: string;
  format: string;
}

export function writeOutput(filePath: string, content: string, opts: CliOptions): void {
  if (opts.format === 'stdout') {
    console.log(`\n--- ${filePath} ---`);
    console.log(content);
    return;
  }

  if (opts.format === 'json') {
    // JSON mode collects files — handled by caller
    return;
  }

  const fullPath = join(opts.output, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf-8');
}

export function log(msg: string): void {
  console.log(`  ${msg}`);
}

export function heading(msg: string): void {
  console.log(`\n  ${msg}`);
  console.log(`  ${'─'.repeat(msg.length)}`);
}

export function done(dir: string, fileCount: number): void {
  console.log(`\n  Done! ${fileCount} files written to ${dir}\n`);
}
