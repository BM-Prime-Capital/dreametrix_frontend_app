// -----------------------------------------------------------------------------
// Henock BARAKAEL — Plan & Curriculum Module Service
// -----------------------------------------------------------------------------

import { getBackendUrl } from "@/app/utils/tenant";
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
  const base = (tenantPrimaryDomain && tenantPrimaryDomain.trim()) || getBackendUrl();
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

    console.log("📥 Fetching unit plan from:", url);

    const res = await fetch(url, { 
      headers: buildAuthHeaders(accessToken) 
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    
    const data = await res.json();
    console.log("✅ Unit plan details received:", data);
    return data;
  }

  /**
   * POST /plans/unit-plans/
   */
  static async create(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    data: any //  Acceptez any pour éviter les problèmes de typage
  ): Promise<UnitPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}`;

    //  Utilisez directement les données reçues sans transformation
    const payload = {
      title: data.title,
      course: data.course, //  Gardez tel quel
      scope_sequence: data.scope_sequence,
      duration_weeks: data.duration_weeks,
      start_date: data.start_date,
      end_date: data.end_date,
      big_idea: data.big_idea,
      essential_questions: data.essential_questions,
      standards: data.standards,
      learning_objectives: data.learning_objectives,
      assessments_formative: data.assessments_formative,
      assessments_summative: data.assessments_summative,
      activities: data.activities,
      materials: data.materials,
      pacing_calendar: data.pacing_calendar,
      differentiation_strategies: data.differentiation_strategies
    };

    console.log("📤 [UnitPlanService.create] Final payload:", payload);

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
   * PUT /plans/unit-plans/:id/
   */
  static async update(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string,
    data: any //  Acceptez any ici aussi
  ): Promise<UnitPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.UNIT_PLANS}${id}/`;

    const payload = {
      title: data.title,
      course: data.course,
      scope_sequence: data.scope_sequence,
      duration_weeks: data.duration_weeks,
      start_date: data.start_date,
      end_date: data.end_date,
      big_idea: data.big_idea,
      essential_questions: data.essential_questions,
      standards: data.standards,
      learning_objectives: data.learning_objectives,
      assessments_formative: data.assessments_formative,
      assessments_summative: data.assessments_summative,
      activities: data.activities,
      materials: data.materials,
      pacing_calendar: data.pacing_calendar,
      differentiation_strategies: data.differentiation_strategies
    };

    console.log("📤 [UnitPlanService.update] Final payload:", payload);

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
// Dans votre plan-service.ts, ajoutez la classe LessonPlanService
export class LessonPlanService {
  /**
   * GET /plans/lesson-plans/
   */
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

    console.log("Fetching lesson plans from:", url);

    const res = await fetch(url, {
      headers: buildAuthHeaders(accessToken),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    
    const data = await res.json();
    console.log("Lesson plans response:", data);
    
    return data.results || [];
  }

  /**
   * GET /plans/lesson-plans/:id/
   */
  static async get(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string
  ): Promise<LessonPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}${id}/`;

    console.log("📥 Fetching lesson plan from:", url);

    const res = await fetch(url, { 
      headers: buildAuthHeaders(accessToken) 
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    
    const data = await res.json();
    console.log("✅ Lesson plan details received:", data);
    return data;
  }

  /**
   * POST /plans/lesson-plans/
   */
  static async create(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    data: Partial<LessonPlan>
  ): Promise<LessonPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}`;

    const payload = {
      title: data.title,
      date: data.date,
      course: data.course, // ID de la classe
      unit_plan: data.unitPlanId || null,
      duration_minutes: data.durationMinutes,
      objectives: data.objectives,
      standards: data.standards,
      procedures: data.procedures,
      materials: data.materials,
      differentiation: data.differentiation || "",
      assessment_formative: data.assessmentFormative,
      homework: data.homework || "",
      notes: data.notes || "",
    };

    console.log("📤 [LessonPlanService.create] Payload:", payload);

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
   * PUT /plans/lesson-plans/:id/
   */
  static async update(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string,
    data: Partial<LessonPlan>
  ): Promise<LessonPlan> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}${id}/`;

    const payload = {
      title: data.title,
      date: data.date,
      course: data.course,
      unit_plan: data.unitPlanId || null,
      duration_minutes: data.durationMinutes,
      objectives: data.objectives,
      standards: data.standards,
      procedures: data.procedures,
      materials: data.materials,
      differentiation: data.differentiation || "",
      assessment_formative: data.assessmentFormative,
      homework: data.homework || "",
      notes: data.notes || "",
    };

    console.log("📤 [LessonPlanService.update] Payload:", payload);

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
   * DELETE /plans/lesson-plans/:id/
   */
  static async delete(
    tenantPrimaryDomain: string | undefined,
    accessToken: string | undefined,
    id: string
  ): Promise<void> {
    assertToken(accessToken);
    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${PLAN_ENDPOINTS.LESSON_PLANS}${id}/`;

    console.log("🗑️ Deleting lesson plan:", url);

    const res = await fetch(url, {
      method: "DELETE",
      headers: buildAuthHeaders(accessToken),
    });
    if (!res.ok) return normalizeFetchError(res, accessToken);
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
      name: string;
      teacher: string;
      studentsCount: number;
    }[]
  > {
    assertToken(accessToken);

    const base = resolveBaseURL(tenantPrimaryDomain);
    const url = `${base}${this.ENDPOINT}`;

    console.log("📚 Fetching classes from:", url);

    const res = await fetch(url, {
      headers: buildAuthHeaders(accessToken, {
        Accept: "application/json",
      }),
    });

    if (!res.ok) return normalizeFetchError(res, accessToken);
    const data = await res.json();

    console.log(" Classes raw data received:", data);

    //  CORRECTION: Format cohérent pour le frontend
    const formattedClasses = (data.results || []).map((cls: any) => ({
      id: cls.id,
      subject: cls.subject_in_short || "", // "Math", "Art", "Bio", etc.
      grade: cls.grade || "", // "5", "6", etc.
      name: cls.name || `Class ${cls.grade} - ${cls.subject_in_short}`,
      teacher: cls.teacher?.full_name || "Unknown teacher",
      studentsCount: cls.students?.length || 0,
    }));

    console.log("📋 Formatted classes:", formattedClasses);
    return formattedClasses;
  }
}