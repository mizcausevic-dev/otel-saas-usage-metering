import { describe, expect, it } from "vitest";

import { dashboardSummary, featureSummaries, tenantSummaries } from "./services/meteringService";

describe("usage metering", () => {
  it("aggregates tenant revenue and usage", () => {
    const dashboard = dashboardSummary();
    expect(dashboard.tenantCount).toBeGreaterThanOrEqual(4);
    expect(dashboard.totalBillableUnits).toBeGreaterThan(0);
    expect(dashboard.topRevenueTenant).toBeTruthy();
  });

  it("produces feature summaries with instrument names", () => {
    const features = featureSummaries();
    expect(features.length).toBeGreaterThan(2);
    expect(features[0].meterName).toContain("saas.");
  });

  it("sorts tenants by estimated revenue", () => {
    const tenants = tenantSummaries();
    expect(tenants[0].estimatedRevenue).toBeGreaterThanOrEqual(
      tenants[tenants.length - 1].estimatedRevenue
    );
  });
});
