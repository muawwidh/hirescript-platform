import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Inbox } from "lucide-react";

const items = [
  { title: "Senior Frontend Engineer", company: "Acme Corp", time: "2 hours ago", tone: "Professional" },
  { title: "Product Designer", company: "Studio Lumen", time: "Yesterday", tone: "Inspiring" },
  { title: "Data Scientist", company: "QuantWorks", time: "3 days ago", tone: "Bold" },
  { title: "Engineering Manager", company: "Northwind", time: "Last week", tone: "Friendly" },
];

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — HireScript AI" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">History</h1>
      {items.length === 0 ? (
        <Card className="p-12 text-center shadow-soft">
          <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold">No generations yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first job description.</p>
          <Button asChild className="mt-4"><Link to="/generate">Generate JD</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((r) => (
            <Card key={r.title} className="p-4 shadow-soft hover:shadow-elegant transition-smooth flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.title}</div>
                <div className="text-sm text-muted-foreground truncate">{r.company} · {r.time}</div>
              </div>
              <Badge variant="outline">{r.tone}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  ),
});
