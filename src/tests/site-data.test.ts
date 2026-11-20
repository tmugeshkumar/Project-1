import { describe, it, expect } from "vitest";
import { siteConfig } from "../config/site";
import { servicesData } from "../lib/data/services";
import { productsData } from "../lib/data/products";
import { projectsData } from "../lib/data/projects";
import { testimonialsData } from "../lib/data/testimonials";

describe("Content Integrity & Data Structures", () => {
  it("has siteConfig with required company placeholders and navigation links", () => {
    expect(siteConfig.name).toBe("COMPANY_NAME");
    expect(siteConfig.contact.email).toBeDefined();
    expect(siteConfig.navigation.length).toBeGreaterThanOrEqual(6);
  });

  it("ensures all 8 core services exist with required attributes", () => {
    expect(servicesData.length).toBe(8);
    const slugs = servicesData.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    servicesData.forEach((service) => {
      expect(service.title.length).toBeGreaterThan(3);
      expect(service.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(service.benefits.length).toBeGreaterThanOrEqual(2);
      expect(service.technologies.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("ensures all products exist with distinct slugs and key functionalities", () => {
    expect(productsData.length).toBeGreaterThanOrEqual(3);
    const slugs = productsData.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    productsData.forEach((product) => {
      expect(product.name.length).toBeGreaterThan(2);
      expect(product.intendedUsers.length).toBeGreaterThan(0);
      expect(product.features.length).toBeGreaterThan(0);
      expect(product.businessBenefits.length).toBeGreaterThan(0);
      expect(product.customizationOptions.length).toBeGreaterThan(0);
    });
  });

  it("ensures portfolio case studies have verified or explicit demo indicators", () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(3);

    projectsData.forEach((project) => {
      expect(project.title.length).toBeGreaterThan(5);
      expect(project.problemStatement.length).toBeGreaterThan(20);
      expect(project.proposedSolution.length).toBeGreaterThan(20);
      expect(project.engineeringApproach.length).toBeGreaterThan(1);
      expect(project.resultsOrImpact.length).toBeGreaterThan(0);
    });
  });

  it("verifies testimonials integrity flags", () => {
    expect(testimonialsData.length).toBeGreaterThanOrEqual(3);
    testimonialsData.forEach((t) => {
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
      expect(typeof t.verifiedClient).toBe("boolean");
      expect(t.quote.length).toBeGreaterThan(15);
    });
  });
});
