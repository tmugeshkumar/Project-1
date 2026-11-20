import React from "react";
import Link from "next/link";
import { projectsData } from "@/lib/data/projects";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const FeaturedProjects: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <Badge variant="outline" size="md">
              Portfolio &amp; Case Studies
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineering Solutions in Action
            </h2>
            <p className="text-slate-600 text-base">
              Explore how we solve mission-critical operational challenges with disciplined TypeScript architecture and resilient database engineering.
            </p>
          </div>

          <Button
            href="/work"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Case Studies
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsData.slice(0, 3).map((project) => (
            <Card
              key={project.slug}
              hoverable
              className="p-6 flex flex-col justify-between border-slate-200 bg-white"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    {project.category}
                  </Badge>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {project.clientIndustry}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.overview}
                  </p>
                </div>

                {/* Key Verified Impacts */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Measurable Impact
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {project.resultsOrImpact.slice(0, 2).map((res) => (
                      <div key={res.label} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <p className="text-base font-extrabold text-brand-600 font-mono">
                          {res.metric}
                        </p>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          {res.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-600 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Technical Architecture Case Study
                </span>
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Read Architecture <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
