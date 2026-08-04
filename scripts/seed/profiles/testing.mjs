// ===========================================================================
// SyncWA Seed Profile — Testing
// Purpose: Stress testing, pagination, search, performance validation
// ===========================================================================

import {
  CUSTOMER_CONFIGS,
  PROFILE_QUANTITIES,
} from "../config.mjs";

export function getTestingProfile() {
  return {
    name: "testing",
    customers: CUSTOMER_CONFIGS.testing,
    quantities: PROFILE_QUANTITIES.testing,
  };
}
