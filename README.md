# COMPANY_NAME - Official Software Development & Digital Products Platform

A complete, production-ready website and commercial engine for **COMPANY_NAME**, a modern software development and digital product company. 

Built with **Next.js (App Router)**, **React**, **strict TypeScript**, **Tailwind CSS**, and **PostgreSQL with Prisma ORM**.

---

## 1. Quick Rebranding Guide: Global Company Name Placeholder

The company name placeholder is **`COMPANY_NAME`**. To replace this globally throughout the entire application, you only need to modify one central configuration file:

📁 **[`src/config/site.ts`](file:///c:/Users/muges/OneDrive/Documents/Project%201/src/config/site.ts)**

```typescript
export const siteConfig = {
  name: "YOUR_OFFICIAL_COMPANY_NAME", // <-- Update this string
  legalName: "YOUR_LEGAL_ENTITY_NAME Inc.",
  tagline: "Engineering Custom Software & Scalable Digital Products",
  description: "...",
  contact: {
    email: "contact@yourcompany.com",
    inquiriesEmail: "inquiries@yourcompany.com",
    phone: "+1 (555) 019-2834",
    address: { ... },
    socials: { ... }
  }
};
```
Updating `siteConfig.name` automatically propagates across:
- Navigation bar, footer, and copyright notices.
- Metadata, OpenGraph cards, Twitter summaries, and Schema.org JSON-LD.
- Homepage hero, value proposition, and company introduction.
- Legal templates (Privacy Policy and Terms of Service).
- Transactional email notifications and audit logs.

---

## 2. Business Model Architecture

The application communicates two complementary commercial pillars:

```mermaid
graph LR
    A[COMPANY_NAME Business Architecture] --> B[Model A: Custom Software Engineering]
    A --> C[Model B: Reusable Software Products]
    
    B --> B1[Requirements & System Architecture]
    B --> B2[Full-Stack Iterative Development]
    B --> B3[100% IP & Source Code Handover]

    C --> C1[Pre-Engineered Software Foundations]
    C --> C2[Perpetual Source Licensing]
    C --> C3[Private Cloud Deployment & Customization]
```

- **Model A (Custom Software Development):** Bespoke web applications, business automation pipelines, database engineering, and API integrations for startups, SMBs, and enterprise teams.
- **Model B (Reusable Software Products):** Proprietary, battle-tested modular software engines (e.g., *OpsFlow Engine*, *DataPulse Analytics*, *AuthGate Shield*) available for commercial licensing, rapid private cloud deployment, and tailored customization.

---

## 3. Technology Stack

- **Frontend:** Next.js 14+ (App Router, Server Components & Client Components), React 18, Tailwind CSS.
- **Language:** TypeScript 5.6+ with `"strict": true`, `"noImplicitAny": true`, `"noUnusedLocals": true`.
- **Database:** PostgreSQL with Prisma ORM (Type-safe client generation, migrations, and connection pooling).
- **Icons & Visuals:** Lucide React.
- **Validation:** Zod 3.23+ runtime validation schemas.
- **Anti-Spam & Security:** In-memory sliding-window rate limiting, honeypot traps, submission timing gates, and strict HTTP security headers (CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff).
- **Testing:** Vitest 2.1+ and Testing Library.
- **Email:** Transactional notification engine supporting Resend API, SMTP gateways, and graceful local development logging.

---

## 4. Project Structure

```
├── .env.example                     # Environment variable blueprint
├── .npmrc                           # pnpm build script approval configuration
├── next.config.mjs                  # Security headers & Next.js production options
├── package.json                     # Project manifest and scripts
├── postcss.config.mjs               # PostCSS Tailwind plugins
├── tailwind.config.ts               # Design system color tokens & typography scales
├── tsconfig.json                    # Strict TypeScript compiler options
├── vitest.config.ts                 # Automated testing configuration
├── prisma/
│   └── schema.prisma                # PostgreSQL models for Inquiries and SecurityLogs
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout, Navbar, Footer, Schema.org JSON-LD
│   │   ├── page.tsx                 # 16-section Home Page
│   │   ├── globals.css              # Design tokens and Tailwind directives
│   │   ├── not-found.tsx            # Accessible 404 handler
│   │   ├── robots.ts                # Dynamic robots.txt
│   │   ├── sitemap.ts               # Dynamic XML sitemap generator
│   │   ├── about/page.tsx           # Vision, mission, values, and quality standards
│   │   ├── services/page.tsx        # 8 comprehensive software engineering services
│   │   ├── products/
│   │   │   ├── page.tsx             # Model B product showcase catalog
│   │   │   └── [slug]/page.tsx      # Deep product detail pages (all 10 specs)
│   │   ├── work/
│   │   │   ├── page.tsx             # Portfolio case studies with integrity notices
│   │   │   └── [slug]/page.tsx      # Deep technical case study breakdown
│   │   ├── testimonials/page.tsx    # Transparent client feedback and standards
│   │   ├── contact/page.tsx         # Interactive inquiry form and social channels
│   │   ├── privacy/page.tsx         # Privacy policy template
│   │   ├── terms/page.tsx           # Commercial terms and conditions template
│   │   └── api/
│   │       └── contact/route.ts     # Protected inquiries API endpoint
│   ├── components/
│   │   ├── forms/ContactForm.tsx    # Accessible contact form with validation
│   │   ├── layout/Navbar.tsx        # Responsive desktop & mobile header
│   │   ├── layout/Footer.tsx        # Comprehensive navigation footer
│   │   ├── sections/                # Modular homepage & landing sections
│   │   └── ui/                      # Button, Badge, Card reusable primitives
│   ├── config/
│   │   └── site.ts                  # Centralized company name, contact, navigation
│   ├── lib/
│   │   ├── db.ts                    # Prisma singleton with lazy runtime fallback
│   │   ├── email.ts                 # Transactional notification dispatcher
│   │   ├── rate-limit.ts            # Sliding-window rate limiter
│   │   ├── utils.ts                 # Style mergers and helpers
│   │   ├── data/                    # Factual datasets for services, products, work
│   │   └── validations/contact.ts   # Zod schema for input validation
│   └── tests/                       # Unit & integration test suites
```

---

## 5. API Documentation: `/api/contact`

**Endpoint:** `POST /api/contact`  
**Content-Type:** `application/json`

### Request Body Schema (Validated by Zod):
```json
{
  "fullName": "Sarah Jenkins",             // Required (min: 2, max: 100)
  "email": "sarah@acme.com",               // Required (valid email, max: 255)
  "companyName": "Acme Corporation",       // Optional (max: 120)
  "projectType": "custom_software",        // Enum: custom_software | product_licensing | automation | modernization | consulting | other
  "budgetRange": "25k_50k",                // Optional Enum: under_10k | 10k_25k | 25k_50k | 50k_plus | undecided
  "projectDescription": "...",             // Required (min: 15, max: 3000)
  "honeypot": "",                          // Anti-spam field (must be empty)
  "submissionTimestamp": 1732115000000     // Anti-spam client mount timestamp
}
```

### Response Statuses:
- `201 Created`: Inquiry persisted to PostgreSQL and transactional notification sent.
- `400 Bad Request`: Invalid JSON payload.
- `422 Unprocessable Entity`: Zod validation errors (field-specific feedback returned).
- `429 Too Many Requests`: Rate limit exceeded (> 5 requests/minute from the same IP). Returns `Retry-After` header.
- `500 Internal Server Error`: Generic safe error returned without leaking stack traces.

---

## 6. Testing & Quality Assurance

The project includes an automated test suite executed with Vitest:

```bash
# Run all unit and integration tests
pnpm test
```

### Verified Test Suites:
1. `src/tests/validations.test.ts` (6 tests): Validates Zod schema against boundary inputs, email formats, and invalid project types.
2. `src/tests/rate-limit.test.ts` (2 tests): Verifies sliding window rate limit enforcement and request window expiration.
3. `src/tests/email.test.ts` (1 test): Verifies fallback logging and notification payload construction.
4. `src/tests/site-data.test.ts` (5 tests): Enforces data integrity across all 8 services, products, portfolio case studies, and testimonials.

**Result:** `14 passed (14 total) | 100% passing`

---

## 7. Local Setup Instructions

### Prerequisites:
- Node.js 18+ (tested on Node.js v20.18.0 LTS)
- pnpm 9+ or 12+ (or npm)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Customize the settings as needed:
```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
CONTACT_RECEIVER_EMAIL="inquiries@company-name.com"
# Optional PostgreSQL connection:
# DATABASE_URL="postgresql://user:password@localhost:5432/company_db?schema=public"
```

### Step 3: Run Database Migrations (Optional)
If connecting to a live PostgreSQL instance:
```bash
pnpm db:push
```
*Note: If `DATABASE_URL` is omitted, the application runs seamlessly in local staging mode, logging incoming inquiries to stdout.*

### Step 4: Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Production Build & Deployment

### Production Compilation:
```bash
pnpm build
```
Generates 20/20 optimized static and dynamic routes with zero TypeScript errors.

### Production Start:
```bash
pnpm start
```

### Vercel / Cloud Deployment:
1. Push repository to GitHub or GitLab.
2. Import project into Vercel or your preferred cloud hosting provider.
3. Supply `DATABASE_URL` and `RESEND_API_KEY` (or SMTP credentials) in Project Settings &rarr; Environment Variables.
4. Deploy with automatic build detection (`next build`).
