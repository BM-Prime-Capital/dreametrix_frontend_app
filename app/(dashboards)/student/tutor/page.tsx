
"use client";

import {Container }from "@/components/ui/container";

const TutorPage = () => {
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-y-8">
        <h1 className="text-3xl font-bold text-slate-700">Under Maintenance</h1>
        <p className="text-slate-600 text-lg">
          This section is currently unavailable as it is undergoing maintenance. Please check back later.
        </p>
      </div>
    </Container>
  );
};

export default TutorPage;
