import { describe, it, expect } from 'vitest';
import { generateArtifact, generateBundle, SEO_ARTIFACT_TYPES } from './index';
import type { SeoInput } from './index';

const input: SeoInput = {
  siteName: 'Acme Corp',
  siteUrl: 'https://acme.com',
};

describe('generateArtifact', () => {
  it('generates meta tags with correct HTML', () => {
    const artifact = generateArtifact('meta-tags', input);
    expect(artifact.type).toBe('meta-tags');
    expect(artifact.language).toBe('html');
    expect(artifact.content).toContain('<meta');
    expect(artifact.content).toContain('Acme Corp');
    expect(artifact.filename).toBe('meta-tags.html');
  });

  it('generates a valid sitemap', () => {
    const artifact = generateArtifact('sitemap', {
      ...input,
      pages: [{ path: '/', priority: 1.0 }, { path: '/about', priority: 0.8 }],
    });
    expect(artifact.type).toBe('sitemap');
    expect(artifact.language).toBe('xml');
    expect(artifact.content).toContain('<?xml');
    expect(artifact.content).toContain('https://acme.com/');
    expect(artifact.content).toContain('https://acme.com/about');
  });

  it('generates robots.txt', () => {
    const artifact = generateArtifact('robots-txt', input);
    expect(artifact.type).toBe('robots-txt');
    expect(artifact.language).toBe('text');
    expect(artifact.content).toContain('User-agent');
    expect(artifact.filename).toBe('robots.txt');
  });

  it('generates JSON-LD structured data', () => {
    const artifact = generateArtifact('json-ld', {
      ...input,
      jsonLdEntities: [{ type: 'Organization', data: { name: 'Acme Corp' } }],
    });
    expect(artifact.type).toBe('json-ld');
    expect(artifact.content).toContain('application/ld+json');
    expect(artifact.content).toContain('Organization');
  });

  it('generates all 4 artifact types', () => {
    const types = Object.keys(SEO_ARTIFACT_TYPES) as Array<keyof typeof SEO_ARTIFACT_TYPES>;
    for (const type of types) {
      const artifact = generateArtifact(type, input);
      expect(artifact.type).toBe(type);
      expect(artifact.content.length).toBeGreaterThan(10);
    }
  });
});

describe('generateBundle', () => {
  it('generates multiple artifacts', () => {
    const types = Object.keys(SEO_ARTIFACT_TYPES) as Array<keyof typeof SEO_ARTIFACT_TYPES>;
    const bundle = generateBundle(types, input);
    expect(bundle.artifacts).toHaveLength(4);
    expect(bundle.input.siteName).toBe('Acme Corp');
  });
});
