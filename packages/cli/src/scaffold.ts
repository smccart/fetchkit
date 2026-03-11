import type { CliOptions } from './utils.js';
import { heading, log } from './utils.js';
import { brandCmd } from './commands/brand.js';
import { legalCmd } from './commands/legal.js';
import { seoCmd } from './commands/seo.js';
import { securityCmd } from './commands/security.js';

export async function scaffold(opts: CliOptions): Promise<void> {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║           FetchKit Scaffold               ║
  ║   Brand · Legal · SEO · Security          ║
  ╚═══════════════════════════════════════════╝
`);

  heading(`Scaffolding "${opts.name}"`);
  log(`URL: ${opts.url}`);
  log(`Email: ${opts.email}`);
  log(`Framework: ${opts.framework}`);
  log(`App type: ${opts.appType}`);
  log(`Output: ${opts.output}`);

  let totalFiles = 0;

  // Brand
  totalFiles += await brandCmd(opts);

  // Legal
  totalFiles += await legalCmd(opts);

  // SEO
  totalFiles += await seoCmd(opts);

  // Security
  totalFiles += await securityCmd(opts);

  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   Scaffold complete!                      ║
  ║   ${String(totalFiles).padStart(3)} files generated                    ║
  ║   Output: ${opts.output.padEnd(32)}║
  ╚═══════════════════════════════════════════╝
`);
  console.log('  Next steps:');
  console.log('    1. Review generated files in ' + opts.output);
  console.log('    2. Copy brand tokens into your project');
  console.log('    3. Add legal docs to your website');
  console.log('    4. Paste SEO meta tags into your <head>');
  console.log('    5. Integrate security configs into your server');
  console.log('');
}
