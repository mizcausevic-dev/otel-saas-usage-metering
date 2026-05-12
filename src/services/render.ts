import { dashboardSummary, featureSummaries, instruments, payload, tenantSummaries } from "./meteringService";

function escape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function money(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function pageShell(title: string, kicker: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escape(title)}</title>
  <style>
    :root {
      --bg: #07111d;
      --panel: #0d1a2b;
      --line: #1d3655;
      --text: #eef2ff;
      --muted: #98a7c2;
      --accent: #68b7ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Inter, sans-serif;
      background: linear-gradient(180deg, #07111d 0%, #091827 100%);
      color: var(--text);
    }
    .page {
      width: 1440px;
      margin: 0 auto;
      padding: 48px 52px 64px;
      background:
        radial-gradient(circle at top right, rgba(104,183,255,0.16), transparent 30%),
        linear-gradient(180deg, rgba(11,25,41,0.95), rgba(6,14,24,0.98));
      min-height: 920px;
    }
    .frame {
      border: 1px solid var(--line);
      border-radius: 34px;
      padding: 28px 32px 36px;
      background: rgba(11, 22, 37, 0.88);
    }
    .eyebrow {
      color: var(--accent);
      font-size: 15px;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      margin-bottom: 18px;
      font-weight: 700;
    }
    h1 {
      margin: 0;
      font-size: 66px;
      line-height: 0.98;
      color: #f4f1e3;
      font-family: Georgia, "Times New Roman", serif;
      max-width: 1120px;
    }
    .lede {
      margin-top: 18px;
      max-width: 920px;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.6;
    }
    .pill-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .pill {
      border-radius: 999px;
      padding: 10px 16px;
      background: #1a2f4d;
      border: 1px solid #29486e;
      color: #f5f8ff;
      font-size: 15px;
      font-weight: 600;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      margin-top: 28px;
    }
    .stat {
      padding: 22px 22px 18px;
      border-radius: 24px;
      background: #12233a;
      border: 1px solid #25415f;
      min-height: 168px;
    }
    .label {
      color: #a8b6cd;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 13px;
      margin-bottom: 14px;
    }
    .value {
      color: #f4f1e3;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 48px;
      line-height: 0.95;
      margin-bottom: 12px;
    }
    .copy {
      color: #c1cadc;
      font-size: 16px;
      line-height: 1.5;
    }
    .section {
      margin-top: 34px;
      border-radius: 28px;
      border: 1px solid #203654;
      background: #0d1524;
      padding: 28px;
    }
    .section-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .card {
      border-radius: 22px;
      border: 1px solid #263d5f;
      background: #131e32;
      padding: 22px;
      min-height: 250px;
    }
    .card .kicker {
      color: var(--accent);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin-bottom: 18px;
      font-weight: 700;
    }
    .card h2 {
      font-size: 24px;
      line-height: 1.15;
      margin: 0 0 14px;
      color: #f4f1e3;
      font-family: Georgia, "Times New Roman", serif;
    }
    .card p, .card li, .queue td, .queue th, .note {
      color: #bdc7d9;
      font-size: 16px;
      line-height: 1.55;
      margin: 0;
    }
    .card ul {
      padding-left: 18px;
      margin: 0;
    }
    .queue {
      width: 100%;
      border-collapse: collapse;
    }
    .queue th, .queue td {
      text-align: left;
      padding: 14px 12px;
      border-bottom: 1px solid #203654;
      vertical-align: top;
    }
    .queue th {
      color: #8fbfff;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 12px;
    }
    .json {
      background: #07101b;
      border: 1px solid #284462;
      border-radius: 22px;
      padding: 24px;
      margin-top: 24px;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      color: #d7f7da;
      font-size: 15px;
      line-height: 1.45;
      font-family: Consolas, "SFMono-Regular", monospace;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="frame">
      <div class="eyebrow">${escape(kicker)}</div>
      ${body}
    </div>
  </div>
</body>
</html>`;
}

export function renderOverview(): string {
  const dashboard = dashboardSummary();
  const tenants = tenantSummaries();
  return pageShell(
    "OTel SaaS Usage Metering - Overview",
    "otel saas usage metering",
    `
      <h1>Usage telemetry that can power both billing and product analytics without splitting the event contract.</h1>
      <p class="lede">
        OTel SaaS Usage Metering models feature activity as counter and histogram style signals so tenant-level usage,
        billable units, latency, and product-value signals stay inside one measurable stream.
      </p>
      <div class="pill-row">
        <div class="pill">OTel-style counters</div>
        <div class="pill">tenant billing rollups</div>
        <div class="pill">feature usage analytics</div>
        <div class="pill">metering proof surface</div>
      </div>
      <div class="stats">
        <div class="stat"><div class="label">Tenants metered</div><div class="value">${dashboard.tenantCount}</div><div class="copy">Active tenant lanes publishing billable feature activity.</div></div>
        <div class="stat"><div class="label">Usage events</div><div class="value">${dashboard.eventCount}</div><div class="copy">Seeded feature interactions measured through a unified telemetry contract.</div></div>
        <div class="stat"><div class="label">Billable units</div><div class="value">${dashboard.totalBillableUnits.toLocaleString("en-US")}</div><div class="copy">Aggregated usage quantity flowing into downstream billing logic.</div></div>
        <div class="stat"><div class="label">Estimated revenue</div><div class="value">$${money(dashboard.estimatedMonthlyRevenue)}</div><div class="copy">${escape(dashboard.usageRecommendation)}</div></div>
      </div>
      <div class="section">
        <div class="section-grid">
          ${tenants
            .map(
              (tenant) => `
                <div class="card">
                  <div class="kicker">${escape(tenant.plan)}</div>
                  <h2>${escape(tenant.tenant)}</h2>
                  <p>$${money(tenant.estimatedRevenue)} projected monthly revenue from ${tenant.totalBillableUnits.toLocaleString("en-US")} billable units.</p>
                  <p class="note">Top feature: ${escape(tenant.topFeature)} • p95 latency: ${tenant.p95LatencyMs}ms</p>
                  <p class="note">${escape(tenant.productSignal)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `
  );
}

export function renderTenantBoard(): string {
  const tenants = tenantSummaries();
  const rows = tenants
    .map(
      (tenant) => `
        <tr>
          <td>${escape(tenant.tenant)}</td>
          <td>${escape(tenant.plan)}</td>
          <td>${tenant.totalBillableUnits.toLocaleString("en-US")}</td>
          <td>$${money(tenant.estimatedRevenue)}</td>
          <td>${tenant.p95LatencyMs}ms</td>
          <td>${escape(tenant.topFeature)}</td>
        </tr>
      `
    )
    .join("");

  return pageShell(
    "OTel SaaS Usage Metering - Tenant Board",
    "tenant board",
    `
      <h1>Each tenant’s usage lane can be explained in revenue and product terms at the same time.</h1>
      <p class="lede">
        The tenant board turns raw usage counters into customer-level economics so Growth, Finance, and Product can look at the same telemetry without translation.
      </p>
      <div class="section">
        <table class="queue">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Plan</th>
              <th>Billable units</th>
              <th>Estimated revenue</th>
              <th>p95 latency</th>
              <th>Top feature</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `
  );
}

export function renderFeatureBoard(): string {
  const features = featureSummaries();
  return pageShell(
    "OTel SaaS Usage Metering - Feature Board",
    "feature board",
    `
      <h1>Feature-level metering gives the billing system and analytics stack the same truth source.</h1>
      <p class="lede">
        The feature board shows which products are driving billable usage and which instrument names should stay stable across the telemetry estate.
      </p>
      <div class="section">
        <div class="section-grid">
          ${features
            .map(
              (feature) => `
                <div class="card">
                  <div class="kicker">${escape(feature.meterName)}</div>
                  <h2>${escape(feature.feature)}</h2>
                  <p>${feature.eventCount} events • ${feature.totalBillableUnits.toLocaleString("en-US")} billable units • p95 ${feature.p95LatencyMs}ms</p>
                  <p class="note">${escape(feature.leadInsight)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `
  );
}

export function renderVerification(): string {
  return pageShell(
    "OTel SaaS Usage Metering - Verification",
    "verification lane",
    `
      <h1>The local payload proves how telemetry contracts can become billing inputs without adding another event system.</h1>
      <p class="lede">
        This verification snapshot shows the same tenant, feature, and instrument summaries that a downstream billing aggregator or product analytics layer could consume.
      </p>
      <div class="json"><pre>${escape(JSON.stringify(payload(), null, 2))}</pre></div>
    `
  );
}

export function renderDocs(): string {
  const rows = Object.entries(instruments())
    .map(
      ([name, description]) => `
        <tr>
          <th>${escape(name)}</th>
          <td>${escape(description)}</td>
        </tr>
      `
    )
    .join("");

  return pageShell(
    "OTel SaaS Usage Metering - Docs",
    "instrument docs",
    `
      <h1>The instrumentation contract matters as much as the dashboard.</h1>
      <p class="lede">
        These meter names and dimensions are the core of the repo’s usage model. They are designed so billing, observability, and analytics can all rely on the same shape.
      </p>
      <div class="section">
        <table class="queue">
          <tbody>${rows}</tbody>
        </table>
      </div>
    `
  );
}
