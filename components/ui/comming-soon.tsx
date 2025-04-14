import Image from "next/image";
import React from "react";

export default function CommingSoon({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome on {title} page</h1>
      <p className="mt-4 text-muted-foreground">
        The {title} page&apos;s content is{" "}
        <span className="font-bold">COMMING SOON ...</span>
      </p>
    </div>
  );
}
