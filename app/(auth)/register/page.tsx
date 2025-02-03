import Loader from "@/components/Loader";
import RegisterPortal from "@/components/RegisterPortal";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterPortal />
    </Suspense>
  );
}

