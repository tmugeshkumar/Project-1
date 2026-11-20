/**
 * Strict TypeScript Type Definitions
 */

export type ProjectStatus = "available" | "in_development" | "beta" | "enterprise_only";

export type ProjectCategory = 
  | "Enterprise Web Application" 
  | "Workflow Automation" 
  | "API & Cloud Infrastructure" 
  | "Data Analytics & AI" 
  | "Database Systems";

export interface ProductFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  statusLabel: string;
  summary: string;
  problemSolved: string;
  intendedUsers: string[];
  keyFunctionality: string[];
  features: ProductFeature[];
  technologies: string[];
  businessBenefits: string[];
  customizationOptions: string[];
  pricingModel: string;
  previewImage?: string;
  demoUrl?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  deliverables: string[];
  benefits: string[];
  technologies: string[];
  idealFor: string[];
  processSteps: {
    step: number;
    title: string;
    description: string;
  }[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: ProjectCategory;
  clientIndustry: string;
  clientPermissionGranted: boolean;
  clientName?: string;
  isDemonstrationProject: boolean;
  problemStatement: string;
  proposedSolution: string;
  engineeringApproach: string[];
  technologies: string[];
  resultsOrImpact: {
    metric: string;
    label: string;
    verified: boolean;
  }[];
  overview: string;
  previewImage?: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  quote: string;
  rating: number; // 1 to 5
  projectCategory: string;
  verifiedClient: boolean;
  date: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  companyName?: string;
  projectType: 
    | "custom_software" 
    | "product_licensing" 
    | "automation" 
    | "modernization" 
    | "consulting" 
    | "other";
  budgetRange?: 
    | "under_10k" 
    | "10k_25k" 
    | "25k_50k" 
    | "50k_plus" 
    | "undecided";
  projectDescription: string;
  honeypot?: string; // Anti-spam hidden field
  submissionTimestamp?: number; // Anti-spam timing
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
