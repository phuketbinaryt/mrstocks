import { describe, it, expect } from 'vitest';
import { scanPayloadSchema } from '@/lib/ingest/schema';
import sample from './fixtures/sample-scan.json';

describe('scanPayloadSchema', () => {
  it('accepts a real sample payload', () => {
    const result = scanPayloadSchema.safeParse(sample);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.candidate_count).toBe(3);
      expect(result.data.candidates).toHaveLength(3);
      expect(result.data.candidates[0].symbol).toBe('NVDA');
    }
  });

  it('rejects payload missing generated_at', () => {
    const bad = { ...sample, generated_at: undefined };
    expect(scanPayloadSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects payload missing candidates array', () => {
    const bad = { ...sample, candidates: undefined };
    expect(scanPayloadSchema.safeParse(bad).success).toBe(false);
  });

  it('accepts candidate with unknown extra fields (forward-compat)', () => {
    const fwd = {
      ...sample,
      candidates: [{ ...sample.candidates[0], new_field_added_later: 42 }],
    };
    expect(scanPayloadSchema.safeParse(fwd).success).toBe(true);
  });

  it('rejects candidate with missing symbol', () => {
    const bad = {
      ...sample,
      candidates: [{ ...sample.candidates[0], symbol: undefined }],
    };
    expect(scanPayloadSchema.safeParse(bad).success).toBe(false);
  });
});
