import { generateBundle, LEGAL_DOC_TYPES } from '@fetchkit/legal';
import type { LegalDocType } from '@fetchkit/legal';
import type { CliOptions } from '../utils.js';
import { writeOutput, log, heading, done } from '../utils.js';

const ALL_TYPES = Object.keys(LEGAL_DOC_TYPES) as LegalDocType[];

export async function legalCmd(opts: CliOptions): Promise<number> {
  heading(`Generating legal documents for "${opts.name}"`);

  let fileCount = 0;

  log(`Generating ${ALL_TYPES.length} legal documents...`);
  const bundle = generateBundle(ALL_TYPES, {
    companyName: opts.name,
    websiteUrl: opts.url,
    contactEmail: opts.email,
    appType: opts.appType as any,
    includeGdpr: true,
    includeCcpa: true,
  });

  for (const doc of bundle.documents) {
    const slug = doc.type;
    log(`  ${doc.title}`);

    writeOutput(`legal/${slug}.md`, doc.markdown, opts);
    fileCount++;

    writeOutput(`legal/${slug}.html`, doc.html, opts);
    fileCount++;
  }

  done(opts.output + '/legal', fileCount);
  return fileCount;
}
