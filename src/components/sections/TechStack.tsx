import React from "react";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2 } from "lucide-react";

export const TechStack: React.FC = () => {
  const categories = [
    {
      title: "Frontend & Interface",
      description: "Fast, responsive, and accessible client applications.",
      techs: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Zod"],
    },
    {
      title: "Backend & Systems",
      description: "Type-safe APIs, queue runners, and business logic controllers.",
      techs: ["Node.js", "Next.js Route Handlers", "REST APIs", "Webhooks", "BullMQ"],
    },
    {
      title: "Data & Persistence",
      description: "ACID transactional integrity and optimized relational schemas.",
      techs: ["PostgreSQL", "Prisma ORM", "Redis Caching", "SQL Migrations"],
    },
    {
      title: "Testing & DevOps",
      description: "Automated regression suites, linting, and containerized deployments.",
      techs: ["Vitest", "Testing Library", "Docker", "GitHub Actions", "Strict ESLint"],
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="brand" size="md">
            Our Technology Foundation
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Chosen for Reliability, Speed, and Longevity
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We avoid volatile framework trends. We build on battle-tested technologies that ensure your software remains stable, secure, and easily maintainable for years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-subtle transition-all duration-200"
            >
              <h3 className="font-bold text-slate-900 text-base mb-1">{cat.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{cat.description}</p>

              <div className="space-y-2">
                {cat.techs.map((tech) => (
                  <div key={tech} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
