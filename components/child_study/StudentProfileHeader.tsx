/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

export default function StudentProfileHeader({
  student,
}: {
  student: any;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="relative w-24 h-24">
        <Image
          src={student.profile.photo}
          alt={student.name}
          fill
          className="rounded-full object-cover border-4 border-blue-100"
        />
      </div>
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{student.name}</h2>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div>
            <p className="text-muted-foreground">Grade</p>
            <p>{student.grade}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Teacher</p>
            <p>{student.profile.teacher}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Birth Date</p>
            <p>{new Date(student.profile.birthDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p>{student.profile.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}