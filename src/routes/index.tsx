import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, Clock, FileText, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HireScript AI" },
      { name: "description", content: "Your AI hiring workspace. Generate job descriptions in seconds." },
    ],
  }),
  component: Dashboard,
});

const recent = [
  { title: "Senior Frontend Engineer", company: "Acme Corp", time: "2 hours ago", tone: "Professional" },
  { title: "Product Designer", company: "Studio Lumen", time: "Yesterday", tone: "Inspiring" },
  { title: "Data Scientist", company: "QuantWorks", time: "3 days ago", tone: "Bold" },
];

const stats = [
  { label: "JDs generated", value: "248", icon: FileText, trend: "+12%" },
  { label: "Avg. time saved", value: "47m", icon: Clock, trend: "per JD" },
  { label: "Active templates", value: "12", icon: Sparkles, trend: "4 new" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-primary-foreground shadow-elegant animate-fade-in-up">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
        <div className="relative max-w-2xl">
          <Badge className="bg-white/20 text-primary-foreground border-0 backdrop-blur mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Write better job descriptions in seconds.
          </h1>
          <p className="mt-4 text-base md:text-lg opacity-90">
            Tell HireScript about the role — we'll craft a polished, on-brand JD ready to publish.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="shadow-soft">
              <Link to="/generate"><Sparkles className="h-4 w-4 mr-2" /> New Generation</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10">
              <Link to="/history">View history <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Card key={s.label} className="p-5 shadow-soft hover:shadow-elegant transition-smooth animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-3xl font-bold tracking-tight">{s.value}</div>
              </div>
              <div className="rounded-lg bg-secondary p-2"><s.icon className="h-5 w-5 text-primary" /></div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium">
              <TrendingUp className="h-3 w-3" /> {s.trend}
            </div>
          </Card>
        ))}
      </section>

      {/* Recent */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent generations</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/history">See all</Link></Button>
        </div>
        <div className="grid gap-3">
          {recent.map((r) => (
            <Card key={r.title} className="p-4 shadow-soft hover:shadow-elegant transition-smooth flex items-center gap-4 cursor-pointer">
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
      </section>

      {/* CTA */}
      <Card className="p-8 text-center shadow-soft border-dashed bg-gradient-soft">
        <Zap className="h-8 w-8 mx-auto text-primary mb-3" />
        <h3 className="text-lg font-semibold">Ready to hire smarter?</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Spin up a polished job description tuned to your culture and team.
        </p>
        <Button asChild className="mt-4"><Link to="/generate">Generate now</Link></Button>
      </Card>
    </div>
  );
}
