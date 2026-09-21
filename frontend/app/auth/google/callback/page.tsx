"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("token", token);

    router.replace("/dashboard");
  }, [router, searchParams]);

  return <p>Memproses login Google...</p>;
}