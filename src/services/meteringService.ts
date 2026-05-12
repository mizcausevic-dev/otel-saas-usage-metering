import { context, propagation, trace, type Baggage } from "@opentelemetry/api";
import { MeterProvider } from "@opentelemetry/sdk-metrics";

import { sampleUsageEvents } from "../data/sampleUsage";
import {
  FeatureUsageSummary,
  MeteringDashboard,
  MeteringPayload,
  TenantUsageSummary,
  UsageEvent
} from "../types/metrics";

const meterProvider = new MeterProvider();
const meter = meterProvider.getMeter("saas-usage-metering");
void meter.createCounter("saas.feature_usage.events", {
  description: "Counts billable feature usage events by tenant and plan."
});
void meter.createHistogram("saas.feature_usage.latency_ms", {
  description: "Captures latency of billable feature interactions."
});
void meter.createCounter("saas.billing.billable_units", {
  description: "Tracks billable usage units emitted from product events."
});

const PRICE_BOOK: Record<UsageEvent["plan"], number> = {
  Growth: 0.09,
  Enterprise: 0.17,
  Platform: 0.22
};

function percentile95(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
  return sorted[index];
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

function createUsageBaggage(event: UsageEvent): Baggage {
  const baggage = propagation.createBaggage({
    tenant: { value: event.tenant },
    plan: { value: event.plan },
    feature: { value: event.feature }
  });
  const baggageContext = propagation.setBaggage(context.active(), baggage);
  void trace.getTracer("saas-usage-metering").startSpan("usage.event", undefined, baggageContext).end();
  return baggage;
}

export function usageEvents(): UsageEvent[] {
  return sampleUsageEvents.map((event) => {
    createUsageBaggage(event);
    return event;
  });
}

export function tenantSummaries(): TenantUsageSummary[] {
  const grouped = new Map<string, UsageEvent[]>();
  for (const event of usageEvents()) {
    const key = event.tenant;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(event);
  }

  return [...grouped.entries()]
    .map(([tenant, events]) => {
      const plan = events[0].plan;
      const totalBillableUnits = sum(events.map((event) => event.billableUnits));
      const featureCounts = new Map<string, number>();
      for (const event of events) {
        featureCounts.set(event.feature, (featureCounts.get(event.feature) ?? 0) + event.billableUnits);
      }
      const [topFeature] =
        [...featureCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? ["unknown", 0];
      return {
        tenant,
        plan,
        totalBillableUnits,
        estimatedRevenue: money(totalBillableUnits * PRICE_BOOK[plan]),
        p95LatencyMs: percentile95(events.map((event) => event.latencyMs)),
        topFeature,
        productSignal:
          topFeature === "api_requests"
            ? "API-driven adoption is turning observability into billable platform usage."
            : "Workflow and reporting features are driving product-qualified expansion demand."
      };
    })
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue);
}

export function featureSummaries(): FeatureUsageSummary[] {
  const grouped = new Map<string, UsageEvent[]>();
  for (const event of usageEvents()) {
    if (!grouped.has(event.feature)) {
      grouped.set(event.feature, []);
    }
    grouped.get(event.feature)!.push(event);
  }

  return [...grouped.entries()]
    .map(([feature, events]) => ({
      feature,
      eventCount: events.length,
      totalBillableUnits: sum(events.map((event) => event.billableUnits)),
      p95LatencyMs: percentile95(events.map((event) => event.latencyMs)),
      meterName:
        feature === "api_requests"
          ? "saas.feature_usage.events"
          : feature === "workflow_automation"
            ? "saas.billing.billable_units"
            : "saas.feature_usage.latency_ms",
      leadInsight:
        feature === "support_ai_answers"
          ? "Support AI usage is becoming a measurable expansion signal, not just a cost center."
          : "Feature usage can feed both billing and product analytics without separate event taxonomies."
    }))
    .sort((a, b) => b.totalBillableUnits - a.totalBillableUnits);
}

export function dashboardSummary(): MeteringDashboard {
  const events = usageEvents();
  const tenants = tenantSummaries();
  const totalBillableUnits = sum(events.map((event) => event.billableUnits));
  const estimatedMonthlyRevenue = sum(tenants.map((tenant) => tenant.estimatedRevenue));
  return {
    tenantCount: tenants.length,
    eventCount: events.length,
    totalBillableUnits,
    estimatedMonthlyRevenue: money(estimatedMonthlyRevenue),
    topRevenueTenant: tenants[0]?.tenant ?? "Unknown",
    usageRecommendation:
      "Keep feature usage counters, latency histograms, and tenant dimensions in the same telemetry contract so billing and product analytics stay reconciled."
  };
}

export function instruments(): Record<string, string> {
  return {
    "saas.feature_usage.events": "Counter for billable feature events tagged by tenant, plan, and feature.",
    "saas.feature_usage.latency_ms": "Histogram for usage request latency to spot cost and experience regressions.",
    "saas.billing.billable_units": "Counter for monetizable usage units that feed downstream invoicing."
  };
}

export function payload(): MeteringPayload {
  return {
    dashboard: dashboardSummary(),
    tenants: tenantSummaries(),
    features: featureSummaries(),
    instruments: instruments(),
    verificationNote:
      "The demo computes tenant usage, billable units, and feature-level economics in memory while preserving OTel-style instrument naming and baggage dimensions."
  };
}
