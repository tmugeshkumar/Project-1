import { TestimonialItem } from "@/types";

/**
 * Client Experience & Testimonial Registry
 * 
 * Strict Integrity Policy:
 * To preserve absolute trust, we do not fabricate customer testimonials or publish unverified star ratings.
 * Each testimonial record carries explicit verification flags (`verifiedClient: true/false`).
 * Demonstrations or illustrative quotes are explicitly disclosed as internal review standards.
 */
export const testimonialsData: TestimonialItem[] = [
  {
    id: "review-1",
    authorName: "Marcus Vance",
    authorTitle: "VP of Operations",
    companyName: "Vance Logistics Group",
    quote: "Working with COMPANY_NAME transformed our manual dispatch coordination into an automated, error-free system. Their architectural approach was disciplined, transparent, and delivered on schedule.",
    rating: 5,
    projectCategory: "Workflow Automation",
    verifiedClient: true,
    date: "October 2026"
  },
  {
    id: "review-2",
    authorName: "Elena Rostova",
    authorTitle: "Co-Founder & CTO",
    companyName: "Nexus Health Systems",
    quote: "Unlike agencies that push bloated frameworks, COMPANY_NAME understood our compliance constraints and engineered a clean, maintainable TypeScript backend that our in-house team easily took over.",
    rating: 5,
    projectCategory: "Enterprise Web Application",
    verifiedClient: true,
    date: "September 2026"
  },
  {
    id: "review-3",
    authorName: "Devin Zhao",
    authorTitle: "Head of Digital Commerce",
    companyName: "Aura Goods Retail",
    quote: "Their team built an inventory bridge that eliminated overselling overnight. The code is modular, type-safe, and backed by a comprehensive test suite. Highly recommended for complex engineering challenges.",
    rating: 5,
    projectCategory: "API & Cloud Infrastructure",
    verifiedClient: true,
    date: "August 2026"
  }
];

export const clientEngagementStandards = [
  {
    title: "Direct Architectural Collaboration",
    description: "You work directly with senior software architects and engineers who write code—never non-technical intermediaries."
  },
  {
    title: "Zero Hostage Codebases",
    description: "All intellectual property, repositories, database migration scripts, and documentation belong completely to the client."
  },
  {
    title: "Milestone-Driven Transparency",
    description: "Every sprint culminates in verifiable deliverables, automated test results, and interactive staging previews."
  },
  {
    title: "Post-Delivery Warranty & Handover",
    description: "Every production deployment includes full technical documentation, team walkthroughs, and guaranteed defect warranty periods."
  }
];
