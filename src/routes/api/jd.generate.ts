import { createFileRoute } from "@tanstack/react-router";

type JDFormPayload = {
  jobTitle: string;
  seniority: "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Director";
  department?: string;
  location: string;
  workMode: "Onsite" | "Hybrid" | "Remote";
  companyName?: string;
  industry?: string;
  templateId?: string;
  cultureKeywords?: string[];
  mustHaveSkills: string[];
  niceToHaveSkills?: string[];
  yearsExperience?: number | string;
  educationRequirement?: "None" | "Bachelor's" | "Master's" | "PhD";
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits?: string[];
  growthOpportunity?: string;
  tone: "Professional" | "Friendly" | "Inspiring" | "Bold" | "Casual";
  targetLength: "Short" | "Medium" | "Long";
  targetPersona?: string;
  notes?: string;
};

type BackendJDResponse = {
  id?: string;
  content?: string;
  detail?: string;
  message?: string;
};

const seniorityMap: Record<JDFormPayload["seniority"], string> = {
  Intern: "INTERN",
  Junior: "JUNIOR",
  Mid: "MID",
  Senior: "SENIOR",
  Lead: "LEAD",
  Director: "DIRECTOR",
};

const workModeMap: Record<JDFormPayload["workMode"], string> = {
  Onsite: "ON_SITE",
  Hybrid: "HYBRID",
  Remote: "REMOTE",
};

const toneMap: Record<JDFormPayload["tone"], string> = {
  Professional: "PROFESSIONAL",
  Friendly: "PROFESSIONAL_FRIENDLY",
  Inspiring: "INCLUSIVE",
  Bold: "STARTUP_BOLD",
  Casual: "CONVERSATIONAL",
};

const lengthMap: Record<JDFormPayload["targetLength"], string> = {
  Short: "SHORT",
  Medium: "MEDIUM",
  Long: "LONG",
};

const educationMap: Record<NonNullable<JDFormPayload["educationRequirement"]>, string> = {
  None: "NONE",
  "Bachelor's": "BACHELOR_OR_EQUIV",
  "Master's": "MASTERS_PREFERRED",
  PhD: "PHD_PREFERRED",
};

function getEnvValue(name: string): string | undefined {
  const globals = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __HIRESCRIPT_ENV__?: Record<string, unknown>;
  };
  const runtimeEnv = globals.__HIRESCRIPT_ENV__?.[name];
  const processEnv = globals.process?.env?.[name];
  const viteEnv = import.meta.env?.[name];

  return (
    (typeof runtimeEnv === "string" ? runtimeEnv : undefined) ||
    processEnv ||
    viteEnv
  );
}

function getBackendBaseUrl(): string | undefined {
  const value = getEnvValue("HIRESCRIPT_API_BASE_URL")?.replace(/\/+$/, "");
  if (!value) return undefined;

  return /^https?:\/\//i.test(value) ? value : `http://${value}`;
}

function getBackendTimeoutMs(): number {
  const configured = Number(getEnvValue("HIRESCRIPT_API_TIMEOUT_MS"));
  return Number.isFinite(configured) && configured > 0 ? configured : 30_000;
}

function toBackendPayload(values: JDFormPayload) {
  return {
    ...values,
    seniority: seniorityMap[values.seniority],
    workMode: workModeMap[values.workMode],
    tone: toneMap[values.tone],
    targetLength: lengthMap[values.targetLength],
    educationRequirement: values.educationRequirement
      ? educationMap[values.educationRequirement]
      : undefined,
    yearsExperience:
      typeof values.yearsExperience === "number"
        ? `${values.yearsExperience}+ years`
        : values.yearsExperience,
  };
}

async function readBackendError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as BackendJDResponse;
    if (typeof payload.detail === "string") return payload.detail;
    if (typeof payload.message === "string") return payload.message;
  } catch {
    // Fall back to the generic message below.
  }
  return "Failed to generate job description";
}

export const Route = createFileRoute("/api/jd/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const backendBaseUrl = getBackendBaseUrl();
        if (!backendBaseUrl) {
          return Response.json(
            {
              success: false,
              error: "HIRESCRIPT_API_BASE_URL is not configured",
            },
            { status: 500 },
          );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), getBackendTimeoutMs());

        try {
          const body = (await request.json()) as JDFormPayload;
          const backendResponse = await fetch(`${backendBaseUrl}/api/jd/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBackendPayload(body)),
            signal: controller.signal,
          });

          if (!backendResponse.ok) {
            return Response.json(
              { success: false, error: await readBackendError(backendResponse) },
              { status: backendResponse.status },
            );
          }

          const data = (await backendResponse.json()) as BackendJDResponse;
          if (!data.content) {
            return Response.json(
              { success: false, error: "Backend returned an empty job description" },
              { status: 502 },
            );
          }

          return Response.json({
            success: true,
            data: {
              id: data.id ?? `jd_${Date.now()}`,
              content: data.content,
              createdAt: new Date().toISOString(),
            },
          });
        } catch (error) {
          const message =
            error instanceof DOMException && error.name === "AbortError"
              ? "Job description generation timed out"
              : "Failed to connect to the HireScript API";

          return Response.json({ success: false, error: message }, { status: 502 });
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  },
});
