import RegisterPortal from "@/components/RegisterPortal";
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterPortal />
    </Suspense>
  );
}

