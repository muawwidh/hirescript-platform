import { z } from "zod";

export const seniorityOptions = ["Intern", "Junior", "Mid", "Senior", "Lead", "Director"] as const;
export const workModeOptions = ["Onsite", "Hybrid", "Remote"] as const;
export const toneOptions = ["Professional", "Friendly", "Inspiring", "Bold", "Casual"] as const;
export const lengthOptions = ["Short", "Medium", "Long"] as const;
export const educationOptions = ["None", "Bachelor's", "Master's", "PhD"] as const;
export const currencyOptions = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "SGD"] as const;
export const templateOptions = [
  { id: "tpl_modern", label: "Modern Tech" },
  { id: "tpl_corporate", label: "Corporate Classic" },
  { id: "tpl_startup", label: "Startup Energetic" },
  { id: "tpl_creative", label: "Creative Studio" },
];
export const departmentOptions = [
  "Engineering", "Product", "Design", "Marketing", "Sales",
  "Operations", "Finance", "HR", "Customer Success", "Data",
];

export const jdSchema = z.object({
  jobTitle: z.string().trim().min(2, "Job title is required").max(120),
  seniority: z.enum(seniorityOptions),
  department: z.string().min(1, "Select a department"),
  location: z.string().trim().min(1, "Location is required").max(120),
  workMode: z.enum(workModeOptions),
  companyName: z.string().trim().min(1, "Company name is required").max(120),
  industry: z.string().trim().min(1, "Industry is required").max(80),
  templateId: z.string().min(1, "Choose a template"),
  cultureKeywords: z.array(z.string()).default([]),
  mustHaveSkills: z.array(z.string()).min(1, "Add at least one must-have skill"),
  niceToHaveSkills: z.array(z.string()).default([]),
  yearsExperience: z.coerce.number().min(0).max(50),
  educationRequirement: z.enum(educationOptions),
  salaryMin: z.coerce.number().min(0),
  salaryMax: z.coerce.number().min(0),
  salaryCurrency: z.enum(currencyOptions),
  benefits: z.array(z.string()).default([]),
  growthOpportunity: z.string().max(500).optional().default(""),
  tone: z.enum(toneOptions),
  targetLength: z.enum(lengthOptions),
  targetPersona: z.string().max(200).optional().default(""),
  notes: z.string().max(1000).optional().default(""),
}).refine((d) => d.salaryMax >= d.salaryMin, {
  message: "Max salary must be greater than min",
  path: ["salaryMax"],
});

export type JDFormValues = z.input<typeof jdSchema>;
