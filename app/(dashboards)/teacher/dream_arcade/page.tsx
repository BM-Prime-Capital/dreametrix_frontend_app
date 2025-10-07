"use client";

import MathQuizGame from "@/components/dream_arcade/MathQuizGame";
import PageTitleH1 from "@/components/ui/page-title-h1";

export default function DreamArcadePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <PageTitleH1 title="Dream Arcade" className="text-center" />
        <p className="text-center text-muted-foreground mt-2">Educational games for learning</p>
      </div>
      <MathQuizGame />
    </div>
  );
}
