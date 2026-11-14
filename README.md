# Plant Green 🌿

**Smart Agriculture Platform for Egypt** — one web platform for farm monitoring, automated irrigation and canopy control, an equipment marketplace, agricultural services, insurance management and AI recommendations.

This repository holds the **project blueprint**: a single interactive HTML file that documents the product, its screens, architecture, database, AI design, roadmap and open risks. No code for the platform itself is described here as built; the blueprint is the plan.

[بالعربي ↓](#بالعربي)

---

## What Plant Green does

| Area | What it covers |
|------|----------------|
| **Farm management** | Farms, zones on an interactive map, soil monitoring, devices and sensors, weather, irrigation and canopy control (manual or automatic) |
| **Equipment marketplace** | Store, cart and checkout, orders and shipment tracking, returns, supplier workspace |
| **Services** | Farm cost calculator, maintenance requests, expert consultation, farm performance score |
| **Financial services** | Subscriptions (Free / Basic / Pro), insurance applications, policies and claims (coverage through a licensed partner) |
| **AI** | Farm-aware assistant (RAG), irrigation recommendations, seasonal planner, insights and predictions, anomaly detection |
| **Integrations** | Odoo for products and inventory, Tasleem for return shipments and tracking |

**Roles:** Farm Owner, Agricultural Business, Supplier, Platform Admin, and Insurance Officer (future).

---

## The blueprint file

`plant-green-blueprint.html` is self-contained. Open it in a browser; there is no build step.

| # | Tab | Contents |
|---|-----|----------|
| 1 | Vision | Problem, solution, users, value propositions |
| 2 | Design System | Colors, type scale, radius, states, light and dark tokens |
| 3 | Screens | 38 screens with wireframes and a ready-made UI design prompt for each (AR/EN, light/dark) |
| 4 | UX Flow | 12 user flows, navigation model, route tree |
| 5 | Frontend | Proposed stack, folder structure, key decisions, quality gates |
| 6 | Backend | Two interchangeable variants (.NET 8 and NestJS), shared contract, 111 endpoints in 14 groups |
| 7 | Database | 60 tables, 94 foreign keys, conventions |
| 8 | AI System | 5 models with inputs, outputs and guardrails |
| 9 | Dashboard | Platform Admin analytics layout and metrics dictionary (sample data) |
| 10 | Roadmap | 6 phases over 42 weeks, with a Gantt view, OpEx drivers and monetization |
| 11 | Scaling | Stages, scale triggers, milestones |
| 12 | Roles & RBAC | Permission matrix |
| 13 | Integrations | Odoo inventory sync, Tasleem returns, reliability rules |
| 14 | Risks & Decisions | Open decisions, each tied to the phase that needs it |

**Features of the file itself:** Arabic / English toggle, light / dark theme, a 3D hero scene, and a data-driven engine (see below).

### Reusing it for another project

All content lives in one `PROJECT` object near the top of the script. Replace that object and the engine renders the same 14 tabs for a different product.

### Notes on running it

- The 3D hero loads Three.js (r128) from cdnjs, and fonts load from Google Fonts. Offline, the page still works; the 3D scene and web fonts are skipped.
- Only the **Vision** tab is translated when you switch to English. The other tabs are Arabic.
- Dashboard numbers, AI targets and week estimates are placeholders to be replaced after a pilot baseline.

---

## Architecture at a glance

**Proposed stack** (the source document did not fix technologies, so this is replaceable):

- **Frontend:** React 18, TypeScript, Vite, TanStack Query, Zustand, Tailwind, Radix / shadcn, Recharts, Leaflet or Mapbox GL
- **Backend, two variants with one contract:** ASP.NET Core 8 (Clean Architecture + CQRS) or NestJS 10 (modular monolith)
- **Data:** PostgreSQL 16 with PostGIS, TimescaleDB and pgvector; Redis
- **IoT and jobs:** MQTT, background worker, outbox pattern

**Rules both backends follow:**

- One database schema, shared SQL migrations; ORMs only map.
- Control commands (irrigation, canopy) return `202 Accepted` with a `commandId`; the final state is set when the device acknowledges. Commands are stored in `device_commands`.
- `Idempotency-Key` on checkout and control commands; webhooks signed with HMAC and de-duplicated by `external_event_id`.
- Returns have three independent tracks: workflow, logistics (Tasleem) and resolution (refund or replacement).
- AI is advisory: any control action needs user confirmation unless the user enabled Auto mode.
- Multi-tenancy by `organization_id`, enforced with Row-Level Security.
- Errors as Problem Details (RFC 7807); uniform pagination.

---

## Roadmap

| Phase | Focus | Weeks |
|-------|-------|-------|
| 1 | Core platform: auth, RBAC, farms and zones, IoT ingest, irrigation and canopy control | 1–8 |
| 2 | Marketplace and integrations: catalog, checkout, Odoo, Tasleem | 9–16 |
| 3 | Services: cost calculator, maintenance, experts, performance score | 17–22 |
| 4 | Financial services: subscriptions, insurance, claims | 23–28 |
| 5 | AI: assistant, irrigation recommendations, planner, insights | 29–36 |
| 6 | Admin and optimization: analytics, performance, security review, deployment | 37–42 |

---

## Open decisions

These are flagged High in the blueprint and need an answer before the phase that depends on them:

- **Remote-control safety:** confirmation, device ack and a local fail-safe if the connection drops *(Phase 1)*
- **Device protocol and update rate:** MQTT or HTTP, and ack support *(Phase 1)*
- **Two backends (C# and Node.js):** risk of behavior drift; the shared schema, API contract and contract tests are the mitigation *(Phase 1)*
- **Odoo:** version, API and who owns stock quantities *(Phase 2)*
- **Tasleem:** API capabilities for return shipments and tracking *(Phase 2)*
- **Payment gateway:** not chosen yet; affects checkout, subscriptions and refunds *(Phase 2)*
- **Insurance partner:** coverage and payouts need a licensed partner and a legal agreement *(Phase 4)*

---

## Design tokens

| Token | Value |
|-------|-------|
| Olive | `#2F3A1D` |
| Lime | `#CFFF74` |
| Gray | `#8B9183` |
| Background | `#F3F4EF` |
| Fonts | IBM Plex Sans Arabic, Inter, IBM Plex Mono |

---

## License

Not specified yet.

---

## بالعربي

**Plant Green** منصة ويب للزراعة الذكية في مصر: مراقبة المزرعة بالـ IoT، ري وCanopy أوتوماتيك، سوق معدات، خدمات زراعية، اشتراكات وتأمين، وتوصيات ذكاء اصطناعي، مع تكامل Odoo للمخزون وTasleem للمرتجعات.

الريبو ده فيه **بلوبرنت المشروع**: ملف `plant-green-blueprint.html` واحد مستقل. افتحه في المتصفح من غير أي build. جواه 14 تاب: الرؤية، الـ Design System، 38 شاشة، الـ UX Flow، الـ Frontend والـ Backend، قاعدة البيانات (60 جدول)، نظام الـ AI، الـ Dashboard، الـ Roadmap (6 مراحل / 42 أسبوع)، الـ Scaling، الصلاحيات، التكاملات، والمخاطر والقرارات المفتوحة.

**ملاحظات:**

- الـ Stack المكتوب مقترح، لأن الـ doc الأصلي ما حددش تقنيات.
- مشهد الـ 3D والخطوط بيتحملوا من الإنترنت.
- الترجمة للإنجليزي شغالة في تاب الـ Vision بس لحد دلوقتي.
- أرقام الـ Dashboard وأهداف الـ AI وتقدير الأسابيع قيم مبدئية.
- أهم قرارات لازم تتقفل بدري: حماية التحكم عن بُعد، بروتوكول الأجهزة، اختيار Backend واحد أو الحفاظ على النسختين، بوابة الدفع، وشريك التأمين المرخص.
