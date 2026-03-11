import { generateBundle, SECURITY_ARTIFACT_TYPES } from '@fetchkit/security';
import type { SecurityArtifactType, AppFramework, AuthStrategy } from '@fetchkit/security';
import type { CliOptions } from '../utils.js';
import { writeOutput, log, heading, done } from '../utils.js';

const ALL_TYPES = Object.keys(SECURITY_ARTIFACT_TYPES) as SecurityArtifactType[];

export async function securityCmd(opts: CliOptions): Promise<number> {
  heading(`Generating security configs for "${opts.name}"`);

  let fileCount = 0;

  log(`Framework: ${opts.framework} | App type: ${opts.appType} | Auth: ${opts.auth}`);
  log(`Generating ${ALL_TYPES.length} security artifacts...`);

  const bundle = generateBundle(ALL_TYPES, {
    siteName: opts.name,
    siteUrl: opts.url,
    framework: opts.framework as AppFramework,
    appType: opts.appType as any,
    authStrategy: opts.auth as AuthStrategy,
    corsConfig: { origins: [opts.url] },
  });

  for (const artifact of bundle.artifacts) {
    log(`  ${artifact.title} → ${artifact.filename}`);
    writeOutput(`security/${artifact.filename}`, artifact.content, opts);
    fileCount++;
  }

  done(opts.output + '/security', fileCount);
  return fileCount;
}
