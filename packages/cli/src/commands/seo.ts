import { generateBundle, SEO_ARTIFACT_TYPES } from '@fetchkit/seo';
import type { SeoArtifactType } from '@fetchkit/seo';
import type { CliOptions } from '../utils.js';
import { writeOutput, log, heading, done } from '../utils.js';

const ALL_TYPES = Object.keys(SEO_ARTIFACT_TYPES) as SeoArtifactType[];

export async function seoCmd(opts: CliOptions): Promise<number> {
  heading(`Generating SEO artifacts for "${opts.name}"`);

  let fileCount = 0;

  log(`Generating ${ALL_TYPES.length} SEO artifacts...`);
  const bundle = generateBundle(ALL_TYPES, {
    siteName: opts.name,
    siteUrl: opts.url,
    description: `${opts.name} — Official Website`,
    pages: [
      { path: '/', priority: 1.0, changefreq: 'weekly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/docs', priority: 0.7, changefreq: 'daily' },
    ],
    jsonLdEntities: [
      { type: 'Organization' },
      { type: 'WebSite' },
    ],
  });

  for (const artifact of bundle.artifacts) {
    log(`  ${artifact.title} → ${artifact.filename}`);
    writeOutput(`seo/${artifact.filename}`, artifact.content, opts);
    fileCount++;
  }

  done(opts.output + '/seo', fileCount);
  return fileCount;
}
