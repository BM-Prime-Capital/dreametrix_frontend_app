"use client";





export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="h-full relative">
    
      <main className="">
        {children}
      </main>
    </div>
  );
}