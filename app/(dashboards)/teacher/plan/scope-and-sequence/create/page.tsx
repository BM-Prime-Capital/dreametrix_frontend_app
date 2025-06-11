
import { ScopeAndSequenceForm } from '@/components/plan/scope-and-sequence-form';

export default function CreateScopeAndSequencePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Create New Scope & Sequence</h1>
        <p className="text-muted-foreground">
          Outline the academic year by mapping out units, standards, and pacing month by month.
        </p>
      </div>
      <ScopeAndSequenceForm />
    </div>
  );
}
