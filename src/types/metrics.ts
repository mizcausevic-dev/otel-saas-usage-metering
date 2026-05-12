export type UsageEvent = {
  eventId: string;
  tenant: string;
  plan: "Growth" | "Enterprise" | "Platform";
  feature: string;
  workspace: string;
  actorType: "admin" | "analyst" | "operator";
  quantity: number;
  units: "events" | "rows" | "minutes" | "seats";
  latencyMs: number;
  billableUnits: number;
  timestamp: string;
};

export type TenantUsageSummary = {
  tenant: string;
  plan: UsageEvent["plan"];
  totalBillableUnits: number;
  estimatedRevenue: number;
  p95LatencyMs: number;
  topFeature: string;
  productSignal: string;
};

export type FeatureUsageSummary = {
  feature: string;
  eventCount: number;
  totalBillableUnits: number;
  p95LatencyMs: number;
  meterName: string;
  leadInsight: string;
};

export type MeteringDashboard = {
  tenantCount: number;
  eventCount: number;
  totalBillableUnits: number;
  estimatedMonthlyRevenue: number;
  topRevenueTenant: string;
  usageRecommendation: string;
};

export type MeteringPayload = {
  dashboard: MeteringDashboard;
  tenants: TenantUsageSummary[];
  features: FeatureUsageSummary[];
  instruments: Record<string, string>;
  verificationNote: string;
};
