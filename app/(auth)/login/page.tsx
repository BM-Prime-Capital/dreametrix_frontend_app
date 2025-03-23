import Login from "@/components/Login";
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
