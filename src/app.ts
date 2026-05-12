import express from "express";

import {
  dashboardSummary,
  featureSummaries,
  instruments,
  payload,
  tenantSummaries,
  usageEvents
} from "./services/meteringService";
import {
  renderDocs,
  renderFeatureBoard,
  renderOverview,
  renderTenantBoard,
  renderVerification
} from "./services/render";

const app = express();
const port = Number(process.env.PORT ?? 4672);

app.get("/", (_req, res) => {
  res.type("html").send(renderOverview());
});

app.get("/tenants", (_req, res) => {
  res.type("html").send(renderTenantBoard());
});

app.get("/features", (_req, res) => {
  res.type("html").send(renderFeatureBoard());
});

app.get("/verification", (_req, res) => {
  res.type("html").send(renderVerification());
});

app.get("/docs", (_req, res) => {
  res.type("html").send(renderDocs());
});

app.get("/api/dashboard/summary", (_req, res) => {
  res.json(dashboardSummary());
});

app.get("/api/tenants", (_req, res) => {
  res.json(tenantSummaries());
});

app.get("/api/features", (_req, res) => {
  res.json(featureSummaries());
});

app.get("/api/events", (_req, res) => {
  res.json(usageEvents());
});

app.get("/api/instruments", (_req, res) => {
  res.json(instruments());
});

app.get("/api/sample", (_req, res) => {
  res.json(payload());
});

app.listen(port, "127.0.0.1", () => {
  console.log(`OTel SaaS Usage Metering listening on http://127.0.0.1:${port}`);
});
