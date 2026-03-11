#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { scaffold } from './scaffold.js';
import { brandCmd } from './commands/brand.js';
import { legalCmd } from './commands/legal.js';
import { seoCmd } from './commands/seo.js';
import { securityCmd } from './commands/security.js';

const HELP = `
  fetchkit — Scaffolding-as-a-service for developers and AI agents

  Usage:
    fetchkit scaffold <name>         Full project scaffold (brand + legal + SEO + security)
    fetchkit brand <name>            Generate brand assets (logo SVG, tokens, palette, favicon)
    fetchkit legal <name>            Generate legal documents (privacy, terms, cookies, etc.)
    fetchkit seo <name>              Generate SEO artifacts (meta tags, sitemap, robots.txt, JSON-LD)
    fetchkit security <name>         Generate security configs (CSP, CORS, headers, auth, env)

  Options:
    --output, -o <dir>       Output directory (default: ./fetchkit-output)
    --url <url>              Site URL (default: https://<name>.com)
    --email <email>          Contact email (default: hello@<name>.com)
    --framework <fw>         Target framework: express, nextjs, fastify, hono, generic (default: generic)
    --app-type <type>        App type: website, saas, api, mobile-backend (default: website)
    --auth <strategy>        Auth strategy: jwt, session, oauth2, api-key (default: jwt)
    --format <fmt>           Output format: files, json, stdout (default: files)
    --help, -h               Show this help message
    --version, -v            Show version

  Examples:
    fetchkit scaffold "Acme Inc" --url https://acme.com --email hello@acme.com
    fetchkit brand "CloudSync" --output ./brand
    fetchkit legal "My SaaS" --app-type saas --email legal@mysaas.com
    fetchkit security "API Server" --framework express --app-type api
    fetchkit seo "Acme" --url https://acme.com

  More info: https://fetchkit.dev/docs
`;

const VERSION = '0.1.0';

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      output: { type: 'string', short: 'o', default: './fetchkit-output' },
      url: { type: 'string' },
      email: { type: 'string' },
      framework: { type: 'string', default: 'generic' },
      'app-type': { type: 'string', default: 'website' },
      auth: { type: 'string', default: 'jwt' },
      format: { type: 'string', default: 'files' },
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
    },
  });

  if (values.version) {
    console.log(VERSION);
    return;
  }

  if (values.help || positionals.length === 0) {
    console.log(HELP);
    return;
  }

  const [command, ...rest] = positionals;
  const name = rest.join(' ');

  if (!name && command !== 'help') {
    console.error('Error: project name is required.\n');
    console.log('Usage: fetchkit <command> <name>\n');
    console.log('Run "fetchkit --help" for more information.');
    process.exit(1);
  }

  const opts = {
    name,
    output: values.output as string,
    url: (values.url as string) || `https://${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
    email: (values.email as string) || `hello@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
    framework: (values.framework as string) || 'generic',
    appType: (values['app-type'] as string) || 'website',
    auth: (values.auth as string) || 'jwt',
    format: (values.format as string) || 'files',
  };

  try {
    switch (command) {
      case 'scaffold':
        await scaffold(opts);
        break;
      case 'brand':
        await brandCmd(opts);
        break;
      case 'legal':
        await legalCmd(opts);
        break;
      case 'seo':
        await seoCmd(opts);
        break;
      case 'security':
        await securityCmd(opts);
        break;
      case 'help':
        console.log(HELP);
        break;
      default:
        console.error(`Unknown command: ${command}\n`);
        console.log('Run "fetchkit --help" for available commands.');
        process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
