// ===========================================================================
// SyncWA Seed Profile — Demo
// Purpose: Local development, feature testing, UI screenshots, manual QA
// ===========================================================================

import {
  CUSTOMER_CONFIGS,
  PROFILE_QUANTITIES,
} from "../config.mjs";

export function getDemoProfile() {
  return {
    name: "demo",
    customers: CUSTOMER_CONFIGS.demo,
    quantities: PROFILE_QUANTITIES.demo,
  };
}
