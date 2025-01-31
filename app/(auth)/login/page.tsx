import Loader from "@/components/Loader";
import Login from "@/components/Login";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
