import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — HireScript AI" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Settings</h1>
      <Card className="p-6 shadow-soft">
        <h2 className="font-semibold">Workspace preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize defaults for your team. Coming soon.</p>
      </Card>
    </div>
  ),
});
