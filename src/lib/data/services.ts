import { ServiceDetail } from "@/types";

export const servicesData: ServiceDetail[] = [
  {
    id: "custom-software",
    slug: "custom-software",
    title: "Custom Software Engineering",
    shortDescription: "Tailor-engineered software architectures designed to solve unique organizational bottlenecks with zero compromise.",
    fullDescription: "We engineer proprietary software systems tailored directly to your operational workflows. From domain modeling and relational architecture to high-throughput business logic, our team designs resilient solutions that scale alongside your growth rather than forcing your business into rigid off-the-shelf constraints.",
    iconName: "Code2",
    deliverables: [
      "Technical discovery & architectural specifications",
      "Full-stack web application development",
      "Modular, testable, and documented codebase",
      "Database schema design & migrations",
      "Deployment pipelines & containerization"
    ],
    benefits: [
      "100% intellectual property ownership with no vendor lock-in",
      "Exact alignment with your internal business workflows",
      "Scalable infrastructure designed for long-term operational resilience",
      "Reduced long-term licensing fees compared to multi-seat SaaS packages"
    ],
    technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Prisma", "Docker"],
    idealFor: ["Startups building core IP", "Growing enterprises outgrowing spreadsheets", "Businesses with unique compliance requirements"],
    processSteps: [
      { step: 1, title: "Discovery & Analysis", description: "In-depth sessions to document functional requirements, edge cases, and architectural constraints." },
      { step: 2, title: "System Architecture", description: "Design of database schemas, API contracts, security protocols, and component hierarchies." },
      { step: 3, title: "Iterative Engineering", description: "Sprint-based delivery with continuous code reviews, unit tests, and milestone demonstrations." },
      { step: 4, title: "Deployment & Handover", description: "Production rollout, monitoring configuration, documentation handover, and staff walkthrough." }
    ]
  },
  {
    id: "web-applications",
    slug: "web-applications",
    title: "Modern Web Applications",
    shortDescription: "High-performance, responsive web applications built with Next.js, React, and strict TypeScript.",
    fullDescription: "We build intuitive, lightning-fast web applications combining server-side rendering for optimal performance and SEO with dynamic client-side interactions. Built on the modern React ecosystem, our applications emphasize clean UI/UX, accessibility, and robust type safety.",
    iconName: "Globe",
    deliverables: [
      "Server-rendered & static React frontends",
      "Responsive UI optimized for desktop, tablet, and mobile",
      "Accessible component design (WCAG 2.1 AA compliant)",
      "State management & client caching layers",
      "Core Web Vitals performance optimization"
    ],
    benefits: [
      "Sub-second page loads and seamless user transitions",
      "Unified codebase supporting all modern devices and screen resolutions",
      "Enhanced search engine discoverability through server-side rendering"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zod", "Vitest"],
    idealFor: ["Customer-facing portals", "B2B client dashboards", "SaaS platforms", "Internal management consoles"],
    processSteps: [
      { step: 1, title: "UX Wireframing", description: "Interactive wireframes and design system tokens to align on user journeys." },
      { step: 2, title: "Frontend Implementation", description: "Clean component development adhering to atomic design principles and strict typing." },
      { step: 3, title: "State & API Integration", description: "Connecting UI components to backend endpoints with type-safe contracts and optimistic UI." },
      { step: 4, title: "Performance Auditing", description: "Rigorous testing for bundle size, accessibility, and Lighthouse performance scores." }
    ]
  },
  {
    id: "automation",
    slug: "automation",
    title: "Business Process Automation",
    shortDescription: "Eliminate repetitive manual tasks through reliable background workers, scheduling pipelines, and event hooks.",
    fullDescription: "Manual data entry, disconnected tools, and fragmented communication drain organizational productivity. We build automated workflow engines, asynchronous task runners, and intelligent integration bridges that connect your business tools and execute tasks reliably around the clock.",
    iconName: "Zap",
    deliverables: [
      "Automated event processing & webhook listeners",
      "Batch data synchronization scripts",
      "Document generation (PDFs, invoices, spreadsheets)",
      "Scheduled job runners & cron workers",
      "Audit logging & failure alert notifications"
    ],
    benefits: [
      "Significant reduction in manual data entry hours and human error",
      "Instantaneous operational triggers across distributed tools",
      "Transparent audit trails and real-time failure notification"
    ],
    technologies: ["Node.js", "TypeScript", "Redis", "PostgreSQL", "Webhooks", "Queues"],
    idealFor: ["Operations teams handling repetitive data syncs", "Financial reconciliation workflows", "Logistics and order fulfillment"],
    processSteps: [
      { step: 1, title: "Workflow Mapping", description: "Cataloging current manual steps, error rates, and target automation triggers." },
      { step: 2, title: "Pipeline Architecture", description: "Defining idempotency keys, queue retries, and data validation rules." },
      { step: 3, title: "Integration Build", description: "Developing resilient connectors and data transformers." },
      { step: 4, title: "Fail-safe Testing", description: "Simulating network dropouts and bad inputs to guarantee reliable recovery." }
    ]
  },
  {
    id: "database-systems",
    slug: "database-systems",
    title: "Database Engineering & Optimization",
    shortDescription: "Scalable schema design, indexing strategies, and query optimization for PostgreSQL and transactional databases.",
    fullDescription: "Data is the foundation of every durable application. We engineer normalized, ACID-compliant database architectures, perform query execution analysis, design indexing strategies, and implement robust backup and disaster recovery procedures.",
    iconName: "Database",
    deliverables: [
      "Relational schema modeling & normalization",
      "Prisma / SQL migration scripts",
      "Index tuning & query plan optimization",
      "Connection pooling & caching strategies",
      "Automated backup & recovery protocols"
    ],
    benefits: [
      "Guaranteed data integrity and ACID transaction safety",
      "Fast query responses even as dataset sizes grow into millions of rows",
      "Zero data loss architecture with automated retention policies"
    ],
    technologies: ["PostgreSQL", "Prisma ORM", "Redis", "SQL", "Docker"],
    idealFor: ["High-concurrency applications", "Financial transaction ledgers", "Reporting & analytics datastores"],
    processSteps: [
      { step: 1, title: "Entity Modeling", description: "Mapping core entities, cardinality, foreign keys, and constraint checks." },
      { step: 2, title: "Schema Engineering", description: "Drafting reproducible migration scripts with zero-downtime alterations in mind." },
      { step: 3, title: "Query Benchmarking", description: "EXPLAIN ANALYZE profiling to identify sequential scans and optimize query plans." },
      { step: 4, title: "Production Hardening", description: "Configuring connection limits, read-replicas, and backup schedules." }
    ]
  },
  {
    id: "apis-backends",
    slug: "apis-backends",
    title: "API Development & System Integration",
    shortDescription: "Type-safe RESTful APIs, webhook receivers, and third-party integrations with strict validation.",
    fullDescription: "We engineer resilient, well-documented backend APIs that bridge disparate systems, empower frontend applications, and facilitate secure partner integrations. Every endpoint is defended with runtime schema validation, rate limiting, and structured error responses.",
    iconName: "Network",
    deliverables: [
      "RESTful API endpoints with full TypeScript definitions",
      "Zod request/response validation schemas",
      "Rate limiting, CORS, and security middleware",
      "Third-party API connectors (Stripe, Twilio, SendGrid, etc.)",
      "OpenAPI / Swagger documentation specifications"
    ],
    benefits: [
      "Clear separation of concerns between presentation and business logic",
      "Predictable, type-safe API contracts preventing contract drift",
      "Secure endpoints protected against denial-of-service and brute force attacks"
    ],
    technologies: ["Node.js", "Next.js Route Handlers", "TypeScript", "Zod", "REST", "JSON Web Tokens"],
    idealFor: ["Mobile app backends", "Multi-platform client applications", "SaaS partner integrations"],
    processSteps: [
      { step: 1, title: "Contract Design", description: "Drafting schema interfaces and response formats prior to coding." },
      { step: 2, title: "Route Implementation", description: "Building handlers, middleware, and business controllers with error boundaries." },
      { step: 3, title: "Integration Testing", description: "Executing automated endpoint suites with mock payloads and edge cases." },
      { step: 4, title: "Documentation", description: "Publishing interactive endpoint references and integration guides." }
    ]
  },
  {
    id: "ai-solutions",
    slug: "ai-solutions",
    title: "Applied AI & Data Solutions",
    shortDescription: "Pragmatic, high-utility AI integrations: document analysis, semantic search, and structured data extraction.",
    fullDescription: "We help organizations leverage modern language models and machine intelligence without the hype. We integrate contextual AI capabilities into your software—such as intelligent document parsing, natural language search, structured data extraction, and automated categorization.",
    iconName: "Cpu",
    deliverables: [
      "LLM API integration pipelines with fallback mechanisms",
      "Vector embeddings & semantic search integration",
      "Structured output parsing & validation with Zod",
      "Cost-optimized token management & prompt engineering",
      "Guardrails against prompt injection and hallucinations"
    ],
    benefits: [
      "Automated extraction of structured information from unstructured text/files",
      "Enhanced user experience through intuitive semantic discovery",
      "Controlled API costs through aggressive caching and lean prompts"
    ],
    technologies: ["Gemini API", "OpenAI API", "LangChain", "TypeScript", "Vector Databases"],
    idealFor: ["Contract and invoice analysis", "Support ticket categorization", "Knowledge base semantic search"],
    processSteps: [
      { step: 1, title: "Feasibility Assessment", description: "Evaluating whether AI is the optimal tool vs. deterministic heuristics." },
      { step: 2, title: "Prompt & Pipeline Design", description: "Crafting structured JSON-mode prompts and schema validators." },
      { step: 3, title: "Integration & Caching", description: "Wiring into application logic with Redis caching and retries." },
      { step: 4, title: "Evaluation & Monitoring", description: "Validating output accuracy against real-world test datasets." }
    ]
  },
  {
    id: "maintenance-improvement",
    slug: "maintenance-improvement",
    title: "Software Maintenance & Evolution",
    shortDescription: "Proactive code audits, dependency upgrades, bug resolution, and performance refactoring.",
    fullDescription: "Software requires continuous attention to remain secure, performant, and compatible with evolving dependencies. We provide disciplined maintenance, technical debt reduction, security patch management, and refactoring to extend the productive lifespan of your codebase.",
    iconName: "ShieldCheck",
    deliverables: [
      "Comprehensive codebase architecture & security audits",
      "Scheduled dependency updates and vulnerability patching",
      "Performance refactoring and dead code elimination",
      "Test suite expansion and bug triage",
      "Continuous integration (CI/CD) pipeline modernization"
    ],
    benefits: [
      "Elimination of lingering security vulnerabilities before exploitation",
      "Maintained compatibility with modern browser and runtime standards",
      "Faster feature delivery on a clean, decoupled foundation"
    ],
    technologies: ["TypeScript", "GitHub Actions", "npm/pnpm audit", "Docker", "Sentry"],
    idealFor: ["Legacy codebases needing modernization", "Applications facing technical debt hurdles", "Teams needing ongoing reliability"],
    processSteps: [
      { step: 1, title: "Code Audit", description: "Inspecting codebase health, dependencies, security warnings, and test coverage." },
      { step: 2, title: "Remediation Plan", description: "Prioritizing fixes into high, medium, and low urgency roadmaps." },
      { step: 3, title: "Incremental Refactoring", description: "Applying targeted upgrades with continuous regression testing." },
      { step: 4, title: "Continuous Monitoring", description: "Setting up automated dependency scanning and uptime monitoring." }
    ]
  },
  {
    id: "product-customization",
    slug: "product-customization",
    title: "Product Customization & White-Labeling",
    shortDescription: "Adapting our proprietary reusable software products to match your specific branding and business logic.",
    fullDescription: "Our reusable software products provide an enterprise-grade foundation. Through our customization service, we adapt our existing products (Model B) to your exact brand aesthetics, custom database integrations, unique approval chains, and domain-specific rules—giving you custom software speed at product-level economics.",
    iconName: "SlidersHorizontal",
    deliverables: [
      "Branded theme adaptation and design token customization",
      "Custom business rules & workflow module development",
      "Enterprise single sign-on (SSO) and LDAP integration",
      "Custom reporting engines and data export routines",
      "Dedicated hosting deployment or on-premises setup"
    ],
    benefits: [
      "Weeks to deployment instead of months of greenfield development",
      "Battle-tested core engine with low defect probability",
      "Total tailoring to your proprietary operating procedures"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker"],
    idealFor: ["Clients purchasing COMPANY_NAME software products", "Organizations requiring white-labeled platforms", "Firms needing rapid deployment"],
    processSteps: [
      { step: 1, title: "Gap Analysis", description: "Comparing our base product feature set against your unique requirements." },
      { step: 2, title: "Custom Module Engineering", description: "Developing custom extensions using our pluggable architectural hooks." },
      { step: 3, title: "Branding & Theming", description: "Tailoring typography, color palettes, and corporate identity." },
      { step: 4, title: "Dedicated Rollout", description: "Deploying the customized product to your preferred cloud infrastructure." }
    ]
  }
];
