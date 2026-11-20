import { ProductDetail } from "@/types";

export const productsData: ProductDetail[] = [
  {
    slug: "opsflow-engine",
    name: "OpsFlow Engine",
    tagline: "Event-Driven Workflow Automation & Job Scheduling Core",
    category: "Workflow Automation & Orchestration",
    status: "available",
    statusLabel: "Production Ready",
    summary: "A modular, high-throughput task orchestration engine designed to automate multi-step business procedures, API webhooks, and asynchronous background queues with guaranteed delivery.",
    problemSolved: "Growing businesses frequently suffer from fragmented tools and human error during manual handoffs between CRMs, billing systems, logistics APIs, and notification services. Standard Zapier-style tools become prohibitively costly, lack data privacy, and fail silently under enterprise load.",
    intendedUsers: [
      "Operations teams requiring deterministic event pipelines",
      "Software teams needing an embedded job scheduling microservice",
      "B2B service providers managing multi-tenant customer workflows",
      "Fintech and logistics companies with stringent audit requirements"
    ],
    keyFunctionality: [
      "Visual workflow builder with type-safe state transitions",
      "Idempotent queue execution with exponential backoff retries",
      "Webhook ingestion gateway with cryptographic signature validation",
      "Full JSON payload audit trail and execution timeline replay",
      "Role-based access control and tenant isolation"
    ],
    features: [
      {
        title: "Guaranteed Execution & Dead-Letter Queuing",
        description: "Zero lost events. Failed jobs are captured in isolated dead-letter queues with interactive inspection and one-click replay."
      },
      {
        title: "Microservice & Monolith Embedding",
        description: "Deployable as a standalone microservice with REST/gRPC endpoints or embedded directly inside your existing Node.js codebase."
      },
      {
        title: "Real-time Telemetry Dashboard",
        description: "Live monitoring of queue latencies, job throughput, worker health, and error distribution charts."
      },
      {
        title: "Configurable Webhook Ingestion",
        description: "Ingest and verify payloads from Stripe, Shopify, GitHub, Salesforce, and custom endpoints with sub-10ms processing."
      }
    ],
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "BullMQ", "Tailwind CSS"],
    businessBenefits: [
      "Eliminates 95%+ of manual operational handoffs and reconciliation overhead",
      "Zero per-transaction third-party SaaS fees when deployed on your infrastructure",
      "Complete data ownership and full compliance with GDPR / SOC2 data residency",
      "Easily extends with custom JavaScript/TypeScript worker modules"
    ],
    customizationOptions: [
      "Custom connector adapters for proprietary legacy ERPs and internal databases",
      "Dedicated multi-region clustering and high-availability failover tuning",
      "Tailored UI skinning to align with client corporate design guidelines",
      "Custom enterprise Single Sign-On (SAML/Okta/Azure AD) integration"
    ],
    pricingModel: "One-Time Commercial License with Optional Customization & SLA Support",
    previewImage: "/images/products/opsflow-preview.svg"
  },
  {
    slug: "datapulse-analytics",
    name: "DataPulse Analytics",
    tagline: "Self-Hosted Product Telemetry & Business Intelligence Portal",
    category: "Data Analytics & Telemetry",
    status: "available",
    statusLabel: "Production Ready",
    summary: "A privacy-first analytics and product usage intelligence engine that runs entirely within your private cloud, giving you actionable dashboards without leaking user data to advertising giants.",
    problemSolved: "Modern privacy regulations (GDPR, CCPA, HIPAA) penalize companies that stream sensitive end-user interactions to third-party ad networks. Off-the-shelf BI tools are bloated, expensive, and require ongoing data engineering to deliver basic funnel insights.",
    intendedUsers: [
      "SaaS founders tracking activation, churn, and feature adoption",
      "Healthcare and fintech platforms bound by strict data residency",
      "Product managers needing fast SQL-driven funnel visualization",
      "Internal tooling teams consolidating fragmented reporting silos"
    ],
    keyFunctionality: [
      "Lightweight client tracking SDK (< 4KB, zero dependencies)",
      "High-speed event ingestion buffer with automated aggregation",
      "Interactive cohort retention matrices and conversion funnel explorer",
      "Custom SQL query notebook with shareable chart widgets",
      "Automated daily/weekly executive summary email digests"
    ],
    features: [
      {
        title: "Zero Third-Party Data Leakage",
        description: "All telemetry events remain in your dedicated PostgreSQL or ClickHouse instance. No cookie banners required."
      },
      {
        title: "Dynamic Funnel & Retention Analysis",
        description: "Analyze drop-off points in onboarding flows and calculate 30-day cohort retention curves with a single click."
      },
      {
        title: "Self-Service Query Builder",
        description: "Empower non-technical stakeholders to filter metrics by attributes, regions, device types, or custom metadata."
      },
      {
        title: "Scheduled Stakeholder Reports",
        description: "Automate PDF and HTML reporting delivered straight to Slack channels or executive inboxes."
      }
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "ClickHouse Support", "Tailwind CSS", "Recharts"],
    businessBenefits: [
      "Full regulatory compliance with strict data protection frameworks",
      "Predictable infrastructure costs regardless of monthly event volumes",
      "Lightning-fast local query execution without SaaS network hops"
    ],
    customizationOptions: [
      "Integration with custom internal auth layers and LDAP directories",
      "Specialized calculation formulas for proprietary industry KPIs",
      "Custom data warehouse connectors (Snowflake, BigQuery, Redshift)",
      "Bespoke executive dashboards for investor or board presentations"
    ],
    pricingModel: "Perpetual Source License + Optional Deployment Engineering",
    previewImage: "/images/products/datapulse-preview.svg"
  },
  {
    slug: "authgate-shield",
    name: "AuthGate Shield",
    tagline: "Enterprise Authentication, Session & Multi-Tenant IAM Gateway",
    category: "Security & Identity Management",
    status: "beta",
    statusLabel: "Beta / Early Deployment",
    summary: "A plug-and-play authentication and organization management gateway offering session management, RBAC, magic links, MFA, and audit logging for multi-tenant B2B applications.",
    problemSolved: "Building authentication, password resets, session revocation, organization switching, and multi-factor authentication from scratch consumes 4 to 8 weeks of senior engineering time for every new application, while hosted providers charge punitive per-MAU subscription fees.",
    intendedUsers: [
      "B2B SaaS platforms onboarding multi-user corporate accounts",
      "Internal enterprise portals needing role-based permission gates",
      "Developers launching new platforms who require robust security on day one"
    ],
    keyFunctionality: [
      "Passwordless Magic Link, Passkey (WebAuthn), and TOTP 2FA",
      "Granular Role-Based Access Control (RBAC) with hierarchical scopes",
      "Organization workspaces with member invites and seat controls",
      "Cryptographically signed JWT sessions with Redis-backed revocation",
      "Comprehensive tamper-evident security audit logs"
    ],
    features: [
      {
        title: "Drop-in Next.js & React Client Library",
        description: "Complete UI components for login, signup, reset password, 2FA prompt, and team member management."
      },
      {
        title: "Tamper-Evident Security Audit Log",
        description: "Detailed recording of IP addresses, user agents, credential changes, and privilege escalations."
      },
      {
        title: "Multi-Tenant Workspace Architecture",
        description: "Out-of-the-box support for user membership across multiple organizations with isolated roles."
      },
      {
        title: "Enterprise SSO Ready",
        description: "Modular adapters for SAML 2.0, OpenID Connect, Google Workspace, and Microsoft Azure Entra."
      }
    ],
    technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Prisma", "WebAuthn", "Argon2"],
    businessBenefits: [
      "Saves hundreds of engineering hours on security boilerplate",
      "Prevents recurring MAU fee inflation as user bases grow",
      "Eliminates common authentication vulnerabilities (session fixation, timing attacks)"
    ],
    customizationOptions: [
      "Custom compliance audit log export pipelines (S3, Datadog)",
      "Custom password complexity and session inactivity policies",
      "White-labeled email templates and localized authentication screens"
    ],
    pricingModel: "Source Code License with Implementation Architecture Service",
    previewImage: "/images/products/authgate-preview.svg"
  }
];
