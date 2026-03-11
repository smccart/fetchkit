import { describe, it, expect } from 'vitest';
import { generateArtifact, generateBundle, SECURITY_ARTIFACT_TYPES } from './index';
import type { SecurityInput } from './index';

const input: SecurityInput = {
  siteName: 'Acme Corp',
  siteUrl: 'https://acme.com',
};

describe('generateArtifact', () => {
  it('generates CSP header', () => {
    const artifact = generateArtifact('csp-header', input);
    expect(artifact.type).toBe('csp-header');
    expect(artifact.content).toContain('Content-Security-Policy');
    expect(artifact.filename).toMatch(/csp/);
  });

  it('generates CORS config', () => {
    const artifact = generateArtifact('cors-config', input);
    expect(artifact.type).toBe('cors-config');
    expect(artifact.content).toMatch(/cors/i);
  });

  it('generates security headers', () => {
    const artifact = generateArtifact('security-headers', input);
    expect(artifact.type).toBe('security-headers');
    expect(artifact.content).toContain('Strict-Transport-Security');
  });

  it('generates auth scaffold for JWT', () => {
    const artifact = generateArtifact('auth-scaffold', { ...input, authStrategy: 'jwt' });
    expect(artifact.content).toMatch(/jwt|token/i);
  });

  it('generates auth scaffold for session', () => {
    const artifact = generateArtifact('auth-scaffold', { ...input, authStrategy: 'session' });
    expect(artifact.content).toMatch(/session/i);
  });

  it('generates env template', () => {
    const artifact = generateArtifact('env-template', { ...input, appType: 'saas' });
    expect(artifact.type).toBe('env-template');
    expect(artifact.filename).toBe('.env.example');
    expect(artifact.content).toContain('DATABASE');
  });

  it('generates rate limiter', () => {
    const artifact = generateArtifact('rate-limit', input);
    expect(artifact.type).toBe('rate-limit');
    expect(artifact.content).toMatch(/rate|limit/i);
  });

  it('generates framework-specific output for express', () => {
    const artifact = generateArtifact('csp-header', { ...input, framework: 'express' });
    expect(artifact.content).toContain('helmet');
  });

  it('generates framework-specific output for nextjs', () => {
    const artifact = generateArtifact('csp-header', { ...input, framework: 'nextjs' });
    expect(artifact.content).toMatch(/next/i);
  });

  it('generates all 6 artifact types', () => {
    const types = Object.keys(SECURITY_ARTIFACT_TYPES) as Array<keyof typeof SECURITY_ARTIFACT_TYPES>;
    for (const type of types) {
      const artifact = generateArtifact(type, input);
      expect(artifact.type).toBe(type);
      expect(artifact.content.length).toBeGreaterThan(10);
    }
  });
});

describe('generateBundle', () => {
  it('generates all security artifacts', () => {
    const types = Object.keys(SECURITY_ARTIFACT_TYPES) as Array<keyof typeof SECURITY_ARTIFACT_TYPES>;
    const bundle = generateBundle(types, input);
    expect(bundle.artifacts).toHaveLength(6);
    expect(bundle.input.siteName).toBe('Acme Corp');
  });
});
