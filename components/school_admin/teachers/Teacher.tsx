import React from 'react';
import { TeachersTable } from './teachers-table';
import { ExcelUploadDialog } from './/excel-upload-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
function App() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">TEACHERS</h1>
        <div className="text-sm text-slate-500">
          TEACHER&apos;S CODE: XXXXXXXX
        </div>
      </div>
      <select className="px-2 py-1 border rounded-md text-sm">
        <option>All Classes</option>
        <option>Morning</option>
        <option>Afternoon</option>
      </select>
    </div>
    <div className="flex items-center gap-2 mb-4">
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="mr-2 h-4 w-4" />
        Add New Teacher
      </Button>
      <ExcelUploadDialog />
    </div>
    <div className="w-full overflow-auto rounded-lg border bg-white shadow-sm">
      <TeachersTable />
    </div>
  </section>
  );
}

export default App;
