"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("token", token); router.replace("/dashboard");
  }, [router, searchParams]);

  return <p>Memproses login Google...</p>;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Memproses login Google...</p>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}