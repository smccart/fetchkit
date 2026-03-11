import { describe, it, expect } from 'vitest';
import { generateDocument, generateBundle, LEGAL_DOC_TYPES } from './index';
import type { LegalInput } from './index';

const input: LegalInput = {
  companyName: 'Acme Corp',
  websiteUrl: 'https://acme.com',
  contactEmail: 'legal@acme.com',
};

describe('generateDocument', () => {
  it('generates a privacy policy with markdown and html', () => {
    const doc = generateDocument('privacy-policy', input);
    expect(doc.type).toBe('privacy-policy');
    expect(doc.title).toBe('Privacy Policy');
    expect(doc.markdown).toContain('Acme Corp');
    expect(doc.html).toContain('Acme Corp');
    expect(doc.metadata.wordCount).toBeGreaterThan(0);
    expect(doc.metadata.jurisdiction).toBe('United States');
  });

  it('generates all 6 document types', () => {
    const types = Object.keys(LEGAL_DOC_TYPES) as Array<keyof typeof LEGAL_DOC_TYPES>;
    for (const type of types) {
      const doc = generateDocument(type, input);
      expect(doc.type).toBe(type);
      expect(doc.markdown.length).toBeGreaterThan(100);
      expect(doc.html.length).toBeGreaterThan(100);
    }
  });

  it('includes GDPR section when requested', () => {
    const doc = generateDocument('privacy-policy', { ...input, includeGdpr: true });
    expect(doc.markdown).toMatch(/gdpr|general data protection/i);
  });

  it('includes CCPA section when requested', () => {
    const doc = generateDocument('privacy-policy', { ...input, includeCcpa: true });
    expect(doc.markdown).toMatch(/ccpa|california consumer/i);
  });

  it('uses custom jurisdiction', () => {
    const doc = generateDocument('privacy-policy', { ...input, jurisdiction: 'Germany' });
    expect(doc.markdown).toContain('Germany');
  });
});

describe('generateBundle', () => {
  it('generates multiple documents', () => {
    const bundle = generateBundle(['privacy-policy', 'terms-of-service'], input);
    expect(bundle.documents).toHaveLength(2);
    expect(bundle.documents[0].type).toBe('privacy-policy');
    expect(bundle.documents[1].type).toBe('terms-of-service');
    expect(bundle.input.companyName).toBe('Acme Corp');
  });

  it('generates all document types in a bundle', () => {
    const allTypes = Object.keys(LEGAL_DOC_TYPES) as Array<keyof typeof LEGAL_DOC_TYPES>;
    const bundle = generateBundle(allTypes, input);
    expect(bundle.documents).toHaveLength(6);
  });
});
