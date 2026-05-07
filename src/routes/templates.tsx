import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { templateOptions } from "@/lib/jd-types";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — HireScript AI" }] }),
  component: () => (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Templates</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templateOptions.map((t) => (
          <Card key={t.id} className="p-5 shadow-soft hover:shadow-elegant transition-smooth cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-semibold">{t.label}</div>
            <div className="text-sm text-muted-foreground mt-1">Optimized for {t.label.toLowerCase()} roles.</div>
          </Card>
        ))}
      </div>
    </div>
  ),
});
