// ===========================================================================
// SyncWA Seed Profile — Production
// Purpose: Fresh production deployment. Only creates Platform Owner.
// ===========================================================================

import {
  CUSTOMER_CONFIGS,
  PROFILE_QUANTITIES,
} from "../config.mjs";

export function getProductionProfile() {
  return {
    name: "production",
    customers: CUSTOMER_CONFIGS.production,
    quantities: PROFILE_QUANTITIES.production,
  };
}
