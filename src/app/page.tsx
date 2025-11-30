"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-16 space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-bold text-slate-700 dark:text-slate-200">
        Welcome to Brainloop
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-xl">
        Quick 10-minute revision loops to strengthen your memory.
      </p>

      <button
        onClick={() => router.push("/topic")}
        className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        Start
      </button>
    </div>
  );
}
