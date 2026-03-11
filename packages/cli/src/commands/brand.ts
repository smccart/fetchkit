import {
  generateLogos,
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateFontLinkTag,
  buildFaviconSvg,
  generateManifest,
  generateHtmlSnippet,
  generateSemanticPalette,
  generateLetterhead,
  generateAppIcon,
  generateBrandGuidelines,
  generateEmailSignature,
  fetchIconSvg,
} from '@fetchkit/brand';
import type { CliOptions } from '../utils.js';
import { writeOutput, log, heading, done } from '../utils.js';

export async function brandCmd(opts: CliOptions): Promise<number> {
  heading(`Generating brand assets for "${opts.name}"`);

  let fileCount = 0;

  // Generate logos
  log('Generating logo variations...');
  const variations = await generateLogos(opts.name, 5);
  const selected = variations[0];
  if (!selected) {
    console.error('  Failed to generate logo variations');
    return 0;
  }
  log(`  Selected: ${selected.config.font.family} + ${selected.config.icon.name}`);

  // Design tokens
  log('Generating design tokens...');
  const css = generateCssVariables(selected.config.colors);
  writeOutput('brand/tokens/variables.css', css, opts);
  fileCount++;

  const tailwind = generateTailwindColors(selected.config.colors);
  writeOutput('brand/tokens/tailwind-colors.js', tailwind, opts);
  fileCount++;

  const tokens = generateColorTokensJson(selected.config.colors);
  writeOutput('brand/tokens/colors.json', tokens, opts);
  fileCount++;

  const fontCss = generateFontCss(selected.config.font);
  writeOutput('brand/tokens/font.css', fontCss, opts);
  fileCount++;

  const fontLink = generateFontLinkTag(selected.config.font);
  writeOutput('brand/tokens/font-link.html', fontLink, opts);
  fileCount++;

  // Semantic palette
  log('Generating semantic palette...');
  const palette = generateSemanticPalette(selected.config.colors.iconColor, 'analogous');

  // Favicon
  log('Generating favicon...');
  const iconSvg = await fetchIconSvg(selected.config.icon.id);
  if (iconSvg) {
    const faviconSvg = buildFaviconSvg(iconSvg, selected.config.colors.iconColor);
    writeOutput('brand/favicon/favicon.svg', faviconSvg, opts);
    fileCount++;

    const manifest = generateManifest(opts.name);
    writeOutput('brand/favicon/manifest.json', manifest, opts);
    fileCount++;

    const snippet = generateHtmlSnippet();
    writeOutput('brand/favicon/snippet.html', snippet, opts);
    fileCount++;
  }

  // App icon
  log('Generating app icons...');
  if (iconSvg) {
    const appIcon = generateAppIcon({
      iconSvg,
      iconColor: '#ffffff',
      backgroundColor: selected.config.colors.iconColor,
    });
    writeOutput('brand/app-icon/app-icon-512.svg', appIcon.svg, opts);
    fileCount++;

    writeOutput('brand/app-icon/manifest-icons.json', appIcon.manifestEntry, opts);
    fileCount++;

    writeOutput('brand/app-icon/snippet.html', appIcon.htmlSnippet, opts);
    fileCount++;
  }

  // Letterhead
  log('Generating letterhead...');
  const letterhead = generateLetterhead({
    companyName: opts.name,
    website: opts.url,
    email: opts.email,
    colors: { primary: selected.config.colors.iconColor },
    font: { family: selected.config.font.family, category: selected.config.font.category },
  });
  writeOutput('brand/letterhead/letterhead.svg', letterhead.svg, opts);
  fileCount++;
  writeOutput('brand/letterhead/header.html', letterhead.headerHtml, opts);
  fileCount++;
  writeOutput('brand/letterhead/footer.html', letterhead.footerHtml, opts);
  fileCount++;
  writeOutput('brand/letterhead/print.css', letterhead.printCss, opts);
  fileCount++;

  // Brand guidelines
  log('Generating brand guidelines...');
  const guidelines = generateBrandGuidelines({
    companyName: opts.name,
    colors: selected.config.colors,
    font: selected.config.font,
    palette,
  });
  writeOutput('brand/guidelines.md', guidelines.markdown, opts);
  fileCount++;
  writeOutput('brand/typography.css', guidelines.typographySnippet, opts);
  fileCount++;

  // Email signature
  log('Generating email signature...');
  const signature = generateEmailSignature({
    name: 'Team',
    companyName: opts.name,
    email: opts.email,
    website: opts.url,
    colors: { primary: selected.config.colors.iconColor },
    font: { family: selected.config.font.family, category: selected.config.font.category },
  });
  writeOutput('brand/email-signature.html', signature.html, opts);
  fileCount++;
  writeOutput('brand/email-signature.txt', signature.plainText, opts);
  fileCount++;

  done(opts.output + '/brand', fileCount);
  return fileCount;
}
