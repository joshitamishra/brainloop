"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const handleStart = () => {
    if (status === "authenticated") {
      router.push("/topic");
    } else {
      router.push("/login");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center mt-16 space-y-6 animate-fadeIn">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Always show start page with Start button
  return (
    <div className="flex flex-col items-center mt-16 space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-bold text-slate-700 dark:text-slate-200">
        Welcome {session?.user?.name ? `, ${session.user.name}` : "to Brainloop"}
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-xl">
        Quick 05-minutes revision loops to strengthen your memory.
      </p>

      <button
        onClick={handleStart}
        className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        Start
      </button>
    </div>
  );
}
