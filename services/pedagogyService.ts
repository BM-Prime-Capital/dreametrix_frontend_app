import {
  ScopeSequence,
  UnitPlan,
  LessonPlan
} from "@/types/pedagogy";

class PedagogyService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL + "/pedagogy";
  }

  // Scope and Sequence
  async getScopeSequences(): Promise<ScopeSequence[]> {
    const response = await fetch(`${this.apiUrl}/scope-sequences`);
    return response.json();
  }

  async createScopeSequence(data: Omit<ScopeSequence, 'id'>): Promise<ScopeSequence> {
    const response = await fetch(`${this.apiUrl}/scope-sequences`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Unit Plans
  async getUnitPlans(scopeSequenceId: string): Promise<UnitPlan[]> {
    const response = await fetch(`${this.apiUrl}/unit-plans?scopeSequenceId=${scopeSequenceId}`);
    return response.json();
  }

  async createUnitPlan(data: Omit<UnitPlan, 'id'>): Promise<UnitPlan> {
    const response = await fetch(`${this.apiUrl}/unit-plans`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Lesson Plans
  async getLessonPlans(unitPlanId: string): Promise<LessonPlan[]> {
    const response = await fetch(`${this.apiUrl}/lesson-plans?unitPlanId=${unitPlanId}`);
    return response.json();
  }

  async createLessonPlan(data: Omit<LessonPlan, 'id'>): Promise<LessonPlan> {
    const response = await fetch(`${this.apiUrl}/lesson-plans`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const pedagogyService = new PedagogyService();