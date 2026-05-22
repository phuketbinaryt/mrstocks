import { describe, it, expect } from 'vitest';
import { isMembershipActive } from '@/lib/membership/is-active';

describe('isMembershipActive', () => {
  const future = new Date(Date.now() + 86_400_000);
  const past = new Date(Date.now() - 86_400_000);

  it('null → false', () => expect(isMembershipActive(null)).toBe(false));
  it('active + future expiry → true', () =>
    expect(
      isMembershipActive({ status: 'active', currentPeriodEnd: future }),
    ).toBe(true));
  it('active + null expiry → true (lifetime)', () =>
    expect(
      isMembershipActive({ status: 'active', currentPeriodEnd: null }),
    ).toBe(true));
  it('trialing → true', () =>
    expect(
      isMembershipActive({ status: 'trialing', currentPeriodEnd: future }),
    ).toBe(true));
  it('canceled → false', () =>
    expect(
      isMembershipActive({ status: 'canceled', currentPeriodEnd: future }),
    ).toBe(false));
  it('active but past expiry → false', () =>
    expect(
      isMembershipActive({ status: 'active', currentPeriodEnd: past }),
    ).toBe(false));
});
