# FoundingOS Architecture Diagram

```text
                         ┌─────────────────────────┐
                         │   FoundingOS Web/Console │
                         │ one shell + buyer flags  │
                         └────────────┬────────────┘
                                      │ /api/v1
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
  /api/v1/ops/*               /api/v1/work/*               /api/v1/int/*
  Core.Operations             Core.Workforce                Core.Intelligence
  customers/orders            applicants/jobs                KPIs/funnels/reports
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              │             Shared FoundingOS Backbone         │
              │ Auth • tenant licenses • messaging adapters    │
              │ external mappings • orchestration • telemetry  │
              └───────────────────────┬───────────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │ One PostgreSQL database  │
                         │ shared tables +          │
                         │ core_ops_ / core_workforce_ /
                         │ core_intel_ tables       │
                         └─────────────────────────┘
```

The architecture contains only first-party operational and workforce data.
