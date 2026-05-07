import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Copy, RefreshCw, Download, Pencil, FileText, Loader2, Check } from "lucide-react";
import {
  jdSchema, type JDFormValues,
  seniorityOptions, workModeOptions, toneOptions, lengthOptions,
  educationOptions, currencyOptions, templateOptions, departmentOptions,
} from "@/lib/jd-types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/TagInput";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Job Description — HireScript AI" },
      { name: "description", content: "Create polished job descriptions with AI." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<JDFormValues>({
    resolver: zodResolver(jdSchema),
    defaultValues: {
      jobTitle: "",
      seniority: "Mid",
      department: "",
      location: "",
      workMode: "Hybrid",
      companyName: "",
      industry: "",
      templateId: "tpl_modern",
      cultureKeywords: [],
      mustHaveSkills: [],
      niceToHaveSkills: [],
      yearsExperience: 3,
      educationRequirement: "Bachelor's",
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: "USD",
      benefits: [],
      growthOpportunity: "",
      tone: "Professional",
      targetLength: "Medium",
      targetPersona: "",
      notes: "",
    },
  });

  const onSubmit = async (values: JDFormValues) => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/jd/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed");
      setResult(json.data.content);
      toast.success("Job description generated");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.getValues("jobTitle") || "job-description"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Generate Job Description</h1>
        <p className="text-muted-foreground mt-1">Fill in the details and let AI craft your JD.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <Card className="p-6 shadow-soft">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Section title="Role basics">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField name="jobTitle" label="Job title" placeholder="Senior Frontend Engineer" form={form} />
                  <SelectField name="seniority" label="Seniority" options={seniorityOptions} form={form} />
                  <SelectField name="department" label="Department" options={departmentOptions} form={form} placeholder="Select department" />
                  <TextField name="location" label="Location" placeholder="San Francisco, CA" form={form} />
                  <SelectField name="workMode" label="Work mode" options={workModeOptions} form={form} />
                  <NumberField name="yearsExperience" label="Years experience" form={form} />
                </div>
              </Section>

              <Section title="Company">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField name="companyName" label="Company name" placeholder="Acme Corp" form={form} />
                  <TextField name="industry" label="Industry" placeholder="SaaS / Fintech" form={form} />
                  <SelectField name="templateId" label="Template"
                    options={templateOptions.map((t) => t.id)}
                    labels={Object.fromEntries(templateOptions.map((t) => [t.id, t.label]))}
                    form={form} />
                  <SelectField name="educationRequirement" label="Education" options={educationOptions} form={form} />
                </div>
                <TagField name="cultureKeywords" label="Culture keywords" placeholder="Add keyword and press Enter" form={form} />
              </Section>

              <Section title="Skills">
                <TagField name="mustHaveSkills" label="Must-have skills" placeholder="React, TypeScript..." form={form} />
                <TagField name="niceToHaveSkills" label="Nice-to-have skills" placeholder="GraphQL, Rust..." form={form} />
              </Section>

              <Section title="Compensation & benefits">
                <div className="grid gap-4 md:grid-cols-3">
                  <NumberField name="salaryMin" label="Salary min" form={form} />
                  <NumberField name="salaryMax" label="Salary max" form={form} />
                  <SelectField name="salaryCurrency" label="Currency" options={currencyOptions} form={form} />
                </div>
                <TagField name="benefits" label="Benefits" placeholder="Health insurance, 401k..." form={form} />
                <TextareaField name="growthOpportunity" label="Growth opportunity" placeholder="Career path & development" form={form} />
              </Section>

              <Section title="Voice & audience">
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField name="tone" label="Tone" options={toneOptions} form={form} />
                  <SelectField name="targetLength" label="Target length" options={lengthOptions} form={form} />
                </div>
                <TextField name="targetPersona" label="Target persona" placeholder="Mid-career engineers in fintech" form={form} />
                <TextareaField name="notes" label="Additional notes" placeholder="Anything else the AI should know" form={form} />
              </Section>

              <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-primary shadow-soft hover:shadow-elegant transition-smooth">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Job Description</>}
              </Button>
            </form>
          </Form>
        </Card>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="shadow-soft overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-3 bg-secondary/40">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Preview</span>
              </div>
              {result && !loading && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={copy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={download}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => form.handleSubmit(onSubmit)()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6 min-h-[500px] max-h-[75vh] overflow-y-auto">
              {loading ? (
                <LoadingSkeleton />
              ) : result ? (
                editing ? (
                  <Textarea value={result} onChange={(e) => setResult(e.target.value)} className="min-h-[500px] font-mono text-sm" />
                ) : (
                  <article className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground animate-fade-in-up leading-relaxed">
                    {result}
                  </article>
                )
              ) : (
                <EmptyState />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Separator className="mt-2" />
      </div>
      {children}
    </div>
  );
}

function TextField({ name, label, placeholder, form }: any) {
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Input {...field} placeholder={placeholder} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function NumberField({ name, label, form }: any) {
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Input type="number" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function TextareaField({ name, label, placeholder, form }: any) {
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><Textarea {...field} placeholder={placeholder} rows={3} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function SelectField({ name, label, options, labels, form, placeholder }: any) {
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl><SelectTrigger><SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} /></SelectTrigger></FormControl>
          <SelectContent>
            {options.map((o: string) => (
              <SelectItem key={o} value={o}>{labels?.[o] || o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function TagField({ name, label, placeholder, form }: any) {
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl><TagInput value={field.value || []} onChange={field.onChange} placeholder={placeholder} /></FormControl>
        <FormDescription className="text-xs">Press Enter or comma to add</FormDescription>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-3/4 rounded animate-shimmer bg-secondary" />
      <div className="h-4 w-1/2 rounded animate-shimmer bg-secondary" />
      <div className="space-y-2 mt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-3 rounded animate-shimmer bg-secondary" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground pt-6">
        <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
        AI is writing your job description...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
        <Sparkles className="h-8 w-8 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-lg">Your JD will appear here</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        Fill in the role details on the left, then hit <span className="font-medium text-foreground">Generate</span> to see HireScript AI in action.
      </p>
    </div>
  );
}

