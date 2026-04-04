"use client";

export default function SuccessPage() {
  const goHome = () => {
    window.location.href = "/";
  };

  const goReading = () => {
    window.location.href = "/reading?mode=general";
  };

  const goHistory = () => {
    window.location.href = "/history";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1f2f98] via-[#6e1bb7] to-[#2d52b3] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-10 text-white text-center">
        <h1 className="text-5xl font-bold mb-6">Payment Success</h1>

        <p className="text-white/85 text-xl mb-2">
          Payment completed successfully.
        </p >

        <p className="text-white/60 text-base mb-8">
          You can now return to the homepage or continue to your reading.
        </p >

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={goHome}
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white text-2xl"
          >
            Go Home
          </button>

          <button
            onClick={goReading}
            className="inline-block px-8 py-4 rounded-full border border-white/20 bg-white/10 text-white text-2xl"
          >
            Go to Reading
          </button>

          <button
            onClick={goHistory}
            className="inline-block px-8 py-4 rounded-full border border-white/20 bg-white/10 text-white text-2xl"
          >
            View History
          </button>
        </div>
      </div>
    </main>
  );
}