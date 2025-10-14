// -----------------------------------------------------------------------------
// Henock BARAKAEL — Plan & Curriculum Module Service
// -----------------------------------------------------------------------------

import { BACKEND_BASE_URL } from "@/app/utils/constants";
import {
  ScopeAndSequence,
  ScopeSequenceEntry,
  UnitPlan,
  LessonPlan,
  ScopeAndSequenceFormData,
  UnitPlanFormData,
} from "@/lib/types";

// -----------------------------------------------------------------------------
// Api Error Standardized
// -----------------------------------------------------------------------------
export class PlanApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
    public accessToken?: string
  ) {
    super(message);
    this.name = "PlanApiError";
  }
}

// -----------------------------------------------------------------------------
// Endpoints du module Plan / Curriculum
// -----------------------------------------------------------------------------
const PLAN_ENDPOINTS = {
  COURSES: "/plans/courses/",
  STANDARDS: "/plans/ny-standards/",
  SCOPE_SEQUENCES: "/plans/scope-sequences/",
  UNIT_PLANS: "/plans/unit-plans/",
  LESSON_PLANS: "/plans/lesson-plans/",
  ACTIVITY_SUGGESTIONS: "/plans/activity-suggestions/",
} as const;

// -----------------------------------------------------------------------------
// Helpers communs
// -----------------------------------------------------------------------------
function resolveBaseURL(tenantPrimaryDomain?: string): string {
  const base =
    (tenantPrimaryDomain && tenantPrimaryDomain.trim()) || BACKEND_BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function buildAuthHeaders(
  accessToken?: string,
  extra?: HeadersInit
): HeadersInit {
  const headers: HeadersInit = {
    ...(extra || {}),
  };

  if (!accessToken || accessToken.trim() === "") {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

async function normalizeFetchError(
  response: Response,
  accessToken?: string
): Promise<never> {
  let details: any;
  try {
    details = await response.json();
  } catch {
    try {
      const txt = await response.text();
      details = { raw: txt };
    } catch {
      details = undefined;
    }
  }

  const message =
    (details && (details.message || details.detail)) ||
    `HTTP Error ${response.status}`;
  throw new PlanApiError(message, response.status, details, accessToken);
}

function assertToken(accessToken?: string) {
  if (!accessToken || accessToken.trim() === "") {
    throw new PlanApiError("No token provided", 401, { code: "NO_TOKEN" });
  }
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        toSnakeCase(value),
      ])
    );
  }
  return obj;
}

// -----------------------------------------------------------------------------
// ScopeAndSequenceService
// -----------------------------------------------------------------------------
export class ScopeAndSequenceService {
  /**
   * GET /plans/scope-sequences/
   */
  static async list(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    params?: Record<string, string>
  ): Promise<ScopeAndSequence[]> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);

    const query = new URLSearchParams(params || {}).toString();
    const url = `${base}${PLAN_ENDPOINTS.SCOPE_SEQUENCES}${
      query ? `?${query}` : ""
    }`;

    console.log("Fetching scope & sequences from:", url);

    const res = await fetch(url, {
      headers: buildAuthHeaders(accessToken),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    
    const data = await res.json();
    console.log("Scope & sequences response:", data);
    
    // Retourner le tableau 'results' au lieu de l'objet complet
    return data.results || [];
  }

  /**
   * POST /plans/scope-sequences/
   */
  static async create(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    data: ScopeAndSequenceFormData // tu gardes ton type front propre
  ): Promise<ScopeAndSequence> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.SCOPE_SEQUENCES}`;

    // Conversion automatique pour le backend
    const payload = toSnakeCase(data);

    if (process.env.NODE_ENV === "development") {
      console.log("[ScopeAndSequenceService.create] Payload:", payload);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: buildAuthHeaders(accessToken, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }
  /**
   * GET /plans/scope-sequences/:id/
   */
  static async get(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<ScopeAndSequence> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.SCOPE_SEQUENCES}${id}/`;

    const res = await fetch(url, { headers: buildAuthHeaders(accessToken) });
    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }

  /**
   * DELETE /plans/scope-sequences/:id/
   */
  static async delete(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: number
  ): Promise<void> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.SCOPE_SEQUENCES}${id}/`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: buildAuthHeaders(accessToken),
    });
    if (!res.ok) return normalizeFetchError(res, accessToken);
  }
}

// -----------------------------------------------------------------------------
// UnitPlanService
// -----------------------------------------------------------------------------
// Dans plan-service.ts - Ajoutez ces méthodes à UnitPlanService
export class UnitPlanService {
  /**
   * GET /plans/unit-plans/
   */
  static async list(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    params?: Record<string, string>
  ): Promise<UnitPlan[]> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);

    const query = new URLSearchParams(params || {}).toString();
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}${
      query ? `?${query}` : ""
    }`;

    console.log("Fetching unit plans from:", url);

    const res = await fetch(url, {
      headers: buildAuthHeaders(accessToken),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    
    const data = await res.json();
    console.log("Unit plans response:", data);
    
    return data.results || [];
  }

  /**
   * POST /plans/unit-plans/
   */
  static async create(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    data: UnitPlanFormData
  ): Promise<UnitPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}`;

    // Construire le payload pour le backend
    const payload = {
      title: data.title,
      course: data.subject, 
      scope_sequence: data.scopeSequenceId || null,
      duration_weeks: data.durationWeeks,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      big_idea: data.bigIdea || "",
      essential_questions: data.essentialQuestions,
      standards: data.standards.join(', '), 
      learning_objectives: data.learningObjectives,
      assessments_formative: data.assessmentsFormative,
      assessments_summative: data.assessmentsSummative,
      activities: data.activities,
      materials: data.materials,
      pacing_calendar: data.pacingCalendar,
      differentiation_strategies: data.differentiationStrategies || "",
    };

    console.log("[UnitPlanService.create] Payload:", payload);

    const res = await fetch(url, {
      method: "POST",
      headers: buildAuthHeaders(accessToken, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }

  /**
   * GET /plans/unit-plans/:id/
   */
  static async get(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string
  ): Promise<UnitPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}${id}/`;

    const res = await fetch(url, { headers: buildAuthHeaders(accessToken) });
    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }

  /**
   * PUT /plans/unit-plans/:id/
   */
  static async update(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string,
    data: Partial<UnitPlanFormData>
  ): Promise<UnitPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}${id}/`;

    const payload = {
      title: data.title,
      scope_sequence: data.scopeSequenceId || null,
      duration_weeks: data.durationWeeks,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      big_idea: data.bigIdea || "",
      essential_questions: data.essentialQuestions,
      standards: data.standards?.join(', '),
      learning_objectives: data.learningObjectives,
      assessments_formative: data.assessmentsFormative,
      assessments_summative: data.assessmentsSummative,
      activities: data.activities,
      materials: data.materials,
      pacing_calendar: data.pacingCalendar,
      differentiation_strategies: data.differentiationStrategies || "",
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: buildAuthHeaders(accessToken, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }

  /**
   * DELETE /plans/unit-plans/:id/
   */
  static async delete(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string
  ): Promise<void> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}${id}/`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: buildAuthHeaders(accessToken),
    });
    if (!res.ok) return normalizeFetchError(res, accessToken);
  }
}

// -----------------------------------------------------------------------------
// LessonPlanService
// -----------------------------------------------------------------------------
export class LessonPlanService {
  static async list(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    params?: Record<string, string>
  ): Promise<LessonPlan[]> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const query = new URLSearchParams(params || {}).toString();
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}${
      query ? `?${query}` : ""
    }`;

    const res = await fetch(url, { headers: buildAuthHeaders(accessToken) });
    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }

  static async create(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    data: Partial<LessonPlan>
  ): Promise<LessonPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}`;
    const res = await fetch(url, {
      method: "POST",
      headers: buildAuthHeaders(accessToken, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    return await res.json();
  }
}

// -----------------------------------------------------------------------------
// ClassService (for fetching subjects / grade / course IDs)
// -----------------------------------------------------------------------------
export class ClassService {
  static readonly ENDPOINT = "/classes/";

  /**
   * GET /classes/
   * Returns a list of classes with subject and grade info.
   */
  static async list(
    tenantPrimaryDomain?: string,
    accessToken?: string
  ): Promise<
    {
      id: number;
      subject: string;
      grade: string;
      teacher: string;
      studentsCount: number;
    }[]
  > {
    assertToken(accessToken);

    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${this.ENDPOINT}`;

    const res = await fetch(url, {
      headers: buildAuthHeaders(accessToken, {
        Accept: "application/json",
      }),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    const data = await res.json();

    // Simplify / normalize for frontend use
    return (data.results || []).map((cls: any) => ({
      id: cls.id,
      subject: cls.subject_in_short || cls.subject_in_all_letter || cls.name,
      grade: `Class ${cls.grade}`,
      teacher: cls.teacher?.full_name || "Unknown teacher",
      studentsCount: cls.students?.length || 0,
    }));
  }
}
