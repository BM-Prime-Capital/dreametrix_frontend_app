// components/ui/AttendanceDisplay.tsx
"use client";

interface AttendanceDisplayProps {
  attendance: {
    present: number;
    absent: number;
    late: number;
    half_day: number;
  };
}

// export function AttendanceDisplay({ attendance }: AttendanceDisplayProps) {
//     return (
//       <div className="flex justify-center gap-2">
//         {/* Présences - Vert clair */}
//         {attendance.present > 0 && (
//           <span className="text-emerald-500 font-medium">↑ {attendance.present}</span>
//         )}
  
//         {/* Absences - Rouge vif */}
//         {attendance.absent > 0 && (
//           <span className="text-rose-600 font-medium">↓ {Math.abs(attendance.absent)}</span>
//         )}
  
//         {/* Retards - Bleu/indigo (plus distinct de l'orange) */}
//         {attendance.late > 0 && (
//           <span className="text-indigo-500 font-medium">→ {attendance.late}</span>
//         )}
  
//         {/* Demi-journées - Jaune orangé (plus distinct) */}
//         {attendance.half_day > 0 && (
//           <span className="text-amber-400 font-medium">↕ {attendance.half_day}</span>
//         )}
  
//         {/* Cas vide */}
//         {Object.values(attendance).every(val => val === 0) && (
//           <span className="text-gray-400">-</span>
//         )}
//       </div>
//     );
//   }


  export function AttendanceDisplay({ attendance }: AttendanceDisplayProps) {
    return (
      <div className="flex justify-center gap-2">
        {attendance.present >= 0 && (
          <span className="text-green-600 font-medium">↑ {attendance.present}</span>
        )}
        {attendance.absent !== 0 && (
          <span className="text-red-600 font-medium">↓ {Math.abs(attendance.absent)}</span>
        )}
        {attendance.late >= 0 && (
          <span className=" text-purple-600 font-medium">→ {attendance.late}</span>
        )}
        {attendance.half_day >= 0 && (
          <span className=" text-orange-400 font-medium">↕ {attendance.half_day}</span>
        )}
      </div>
    );
  }