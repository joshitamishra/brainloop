"use client";

import { useRef } from "react";
import { SHLOKS } from "@/data/primary/6-8/shlokas";

export default function ShlokaPage() {
    const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);

    function handlePlay(audioEl: HTMLAudioElement) {
        // Pause any previously playing audio
        if (
            currentlyPlayingRef.current &&
            currentlyPlayingRef.current !== audioEl
        ) {
            currentlyPlayingRef.current.pause();
            currentlyPlayingRef.current.currentTime = 0;
        }

        currentlyPlayingRef.current = audioEl;
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold">Shloka Revision</h1>

            {SHLOKS.map((s) => (
                <div
                    key={s.id}
                    className="p-6 rounded-xl bg-[#161618] border border-[#2d2d30]"
                >
                    <h2 className="text-xl font-semibold mb-4">{s.id}</h2>

                    <p className="text-lg leading-relaxed mb-6">
                        {s.text}
                    </p>

                    <audio
                        controls
                        controlsList="nodownload"
                        className="w-full"
                        onPlay={(e) =>
                            handlePlay(e.currentTarget as HTMLAudioElement)
                        }
                        onEnded={(e) => {
                            if (currentlyPlayingRef.current === e.currentTarget) {
                                currentlyPlayingRef.current = null;
                            }
                        }}
                    >
                        <source src={s.audioUrl} type="audio/mpeg" />
                        Your browser does not support audio playback.
                    </audio>
                </div>
            ))}
        </div>
    );
}
