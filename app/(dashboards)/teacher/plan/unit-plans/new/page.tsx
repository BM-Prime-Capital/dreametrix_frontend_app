import { UnitPlanForm } from '@/components/plan/unit-plan-form';

export default function CreateUnitPlanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Unit Plan</h1>
        <p className="text-muted-foreground">
          Lay the foundation for a series of lessons by defining standards, objectives, and assessments for your unit.
        </p>
      </div>
      <UnitPlanForm />
    </div>
  );
}
