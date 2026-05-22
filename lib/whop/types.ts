// Subset of the Whop REST API response shapes we depend on.
// Verified against Whop docs at https://docs.whop.com (Q2 2026).
// Add fields as we need them — we intentionally keep this narrow.

export interface WhopUser {
  id: string;
  username?: string;
  email: string;
  profile_pic_url?: string | null;
}

export interface WhopMembership {
  id: string;
  product: string; // product / pass id
  user: string; // whop user id
  plan: string;
  status:
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'trialing'
    | 'expired'
    | 'completed';
  valid: boolean;
  renewal_period_end?: number | null; // unix seconds
  expires_at?: number | null; // unix seconds
  created_at?: number;
}

export interface WhopMembershipListResponse {
  data: WhopMembership[];
}
