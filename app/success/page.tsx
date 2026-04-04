"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const applyCredits = async () => {
      if (!sessionId) {
        setError("Missing session id");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/apply-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Failed to apply credits");
          setLoading(false);
          return;
        }

        setCreditsAdded(data?.creditsAdded ?? 0);
        setLoading(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };

    applyCredits();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1f2f98] via-[#6e1bb7] to-[#2d52b3] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-10 text-white text-center">
        {loading ? (
          <>
            <h1 className="text-5xl font-bold mb-6">Processing Payment...</h1>
            <p className="text-white/80 text-xl">
              Please wait while we add your credits.
            </p >
          </>
        ) : error ? (
          <>
            <h1 className="text-5xl font-bold mb-6">Payment Received</h1>
            <p className="text-white/80 text-xl mb-8">{error}</p >

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white text-2xl"
              >
                Go Home
              </Link>

              <Link
                href="/history"
                className="inline-block px-8 py-4 rounded-full border border-white/20 bg-white/10 text-white text-2xl"
              >
                View History
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-bold mb-6">Payment Success</h1>
            <p className="text-white/85 text-xl mb-2">
              Payment successful. {creditsAdded} credits added.
            </p >
            <p className="text-white/60 text-base mb-8">
              Redirecting to home in 3 seconds...
            </p >

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white text-2xl"
              >
                Go Home
              </Link>

              <Link
                href="/reading?mode=general"
                className="inline-block px-8 py-4 rounded-full border border-white/20 bg-white/10 text-white text-2xl"
              >
                Go to Reading
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}