import { Card } from "@/components/ui/card";
import { TeachersTable } from "./teachers-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AddTeacherDialog } from "./add-teacher-dialog";

export default function TeachersPage() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <PageTitleH1 title="TEACHERS" />
          <div className="text-sm text-muted-foreground">
            TEACHER&apos;S CODE: XXXXXXXX
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-2 py-1 border rounded-md text-sm">
            <option>All Classes</option>
            <option>Morning</option>
            <option>Afternoon</option>
          </select>
        </div>
      </div>
      <div>
        <AddTeacherDialog />
      </div>
      <Card className="rounded-md">
        <TeachersTable />
      </Card>
    </section>
  );
}