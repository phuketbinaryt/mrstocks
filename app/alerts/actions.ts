// Thin re-export so /alerts pages can import server actions from a stable
// local module while the implementation lives in lib/alerts/actions.ts.
export {
  createRule,
  createRuleFromForm,
  updateRule,
  updateRuleFromForm,
  toggleRuleActive,
  deleteRule,
} from '@/lib/alerts/actions';
