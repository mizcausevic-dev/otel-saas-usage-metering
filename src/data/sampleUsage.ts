import { UsageEvent } from "../types/metrics";

export const sampleUsageEvents: UsageEvent[] = [
  {
    eventId: "evt-1001",
    tenant: "Northstar Cloud",
    plan: "Enterprise",
    feature: "workflow_automation",
    workspace: "northstar-prod",
    actorType: "operator",
    quantity: 1840,
    units: "events",
    latencyMs: 138,
    billableUnits: 1840,
    timestamp: "2026-05-12T08:14:00Z"
  },
  {
    eventId: "evt-1002",
    tenant: "Northstar Cloud",
    plan: "Enterprise",
    feature: "governance_exports",
    workspace: "northstar-prod",
    actorType: "analyst",
    quantity: 420,
    units: "rows",
    latencyMs: 244,
    billableUnits: 420,
    timestamp: "2026-05-12T08:21:00Z"
  },
  {
    eventId: "evt-1003",
    tenant: "Harborline Finance",
    plan: "Platform",
    feature: "api_requests",
    workspace: "harborline-main",
    actorType: "admin",
    quantity: 12600,
    units: "events",
    latencyMs: 112,
    billableUnits: 12600,
    timestamp: "2026-05-12T08:44:00Z"
  },
  {
    eventId: "evt-1004",
    tenant: "Harborline Finance",
    plan: "Platform",
    feature: "attribution_sync",
    workspace: "harborline-main",
    actorType: "operator",
    quantity: 760,
    units: "rows",
    latencyMs: 196,
    billableUnits: 760,
    timestamp: "2026-05-12T09:01:00Z"
  },
  {
    eventId: "evt-1005",
    tenant: "Cedar Lane Health",
    plan: "Growth",
    feature: "support_ai_answers",
    workspace: "cedarlane-help",
    actorType: "analyst",
    quantity: 980,
    units: "events",
    latencyMs: 161,
    billableUnits: 980,
    timestamp: "2026-05-12T09:15:00Z"
  },
  {
    eventId: "evt-1006",
    tenant: "Cedar Lane Health",
    plan: "Growth",
    feature: "usage_reporting",
    workspace: "cedarlane-help",
    actorType: "admin",
    quantity: 210,
    units: "rows",
    latencyMs: 229,
    billableUnits: 210,
    timestamp: "2026-05-12T09:23:00Z"
  },
  {
    eventId: "evt-1007",
    tenant: "Blueharbor Capital",
    plan: "Enterprise",
    feature: "workflow_automation",
    workspace: "blueharbor-risk",
    actorType: "operator",
    quantity: 2210,
    units: "events",
    latencyMs: 149,
    billableUnits: 2210,
    timestamp: "2026-05-12T09:37:00Z"
  },
  {
    eventId: "evt-1008",
    tenant: "Blueharbor Capital",
    plan: "Enterprise",
    feature: "api_requests",
    workspace: "blueharbor-risk",
    actorType: "operator",
    quantity: 9200,
    units: "events",
    latencyMs: 103,
    billableUnits: 9200,
    timestamp: "2026-05-12T09:54:00Z"
  }
];
