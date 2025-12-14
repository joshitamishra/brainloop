"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { isAnswerCorrect } from "@/lib/normalise";
import { engToHindi } from "@/lib/hindiTranslit";

type Question = {
    text?: string;
    q?: string;
    answer?: string;
    a?: string;
    passage?: string;
};

/* -------------------------------------------
   🎈 BALLOONS FOR CORRECT ANSWERS
------------------------------------------- */
function showBalloons() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        shapes: ["circle"],
        colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"]
    });
    const audio = new Audio("/sounds/yay.mp3");
    audio.volume = 0.5; // adjust 0.0–1.0
    audio.play().catch(() => {
        // Browser blocked autoplay (happens if user hasn’t interacted yet)
        console.warn("Sound could not play automatically.");
    });
}

export default function QuizUI({
    topic,
    category,
    onExit,
}: {
    topic: string;
    category?: string | null;
    onExit: () => void;
}) {
    /* -------------------------------------------
       ⏱ STATE
    ------------------------------------------- */
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState("");
    const [submittedQuestions, setSubmittedQuestions] = useState<
        { q: Question; userAnswer: string; correct: boolean }[]
    >([]);
    const [fade, setFade] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loaded, setLoaded] = useState(false);

    /* -------------------------------------------
       🔊 WRONG SOUND SETUP (WORKING VERSION)
    ------------------------------------------- */
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundSrc = "/sounds/pew_pew.mp3";

    useEffect(() => {
        wrongSoundRef.current = new Audio(wrongSoundSrc);
        wrongSoundRef.current.volume = 0.7;
    }, []);

    function playWrongSound() {
        const audio = wrongSoundRef.current;
        if (!audio) return;

        audio.currentTime = 0;

        audio.play().catch((err) => {
            console.warn("⚠️ Audio blocked, retrying...", err);
            const retry = new Audio(wrongSoundSrc);
            retry.volume = 0.7;
            retry.play().catch((err2) => {
                console.error("❌ Could not play audio:", err2);
            });
        });
    }

    /* -------------------------------------------
       📥 LOAD QUESTIONS
    ------------------------------------------- */
    useEffect(() => {
        const saved = sessionStorage.getItem("currentSessionQuestions");

        if (saved && saved !== "undefined" && saved !== "null") {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setQuestions(parsed);
                }
            } catch (err) {
                console.error("❌ Failed to parse questions:", err);
            }
        }

        setLoaded(true);
    }, []);

    /* -------------------------------------------
       ⏱ TIMER
    ------------------------------------------- */
    useEffect(() => {
        if (!loaded) return;
        if (timeLeft <= 0) return;

        const t = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(t);
    }, [timeLeft, loaded]);

    /* -------------------------------------------
       🧠 QUIZ LOGIC
    ------------------------------------------- */
    const isFinished = loaded && (currentIndex >= questions.length || timeLeft <= 0);
    const isTimeUp = loaded && timeLeft <= 0;

    const totalQuestions = questions.length;
    const correctCount = submittedQuestions.filter((q) => q.correct).length;

    const timeTaken = 300 - timeLeft;
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = (timeTaken % 60).toString().padStart(2, "0");

    /* -------------------------------------------
   📝 SAVE DAILY HISTORY IN INDEXEDDB
------------------------------------------- */
    /* -------------------------------------------
   📝 SAVE DAILY HISTORY IN INDEXEDDB (FIXED)
------------------------------------------- */
    useEffect(() => {
        if (!isFinished) return;

        console.log("🚀 Quiz finished — saving DAILY history…");

        const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        let all: any = {};

        try {
            const stored = localStorage.getItem("brainloop-daily-history");
            if (stored && stored !== "undefined" && stored !== "null") {
                all = JSON.parse(stored);
                if (typeof all !== "object" || all === null) {
                    all = {};
                }
            }
        } catch (err) {
            console.error("❌ Failed to parse daily history:", err);
            all = {};
        }

        // Ensure today’s bucket exists and is an array
        if (!Array.isArray(all[todayKey])) {
            all[todayKey] = [];
        }

        const record = {
            timestamp: Date.now(),
            topic,
            score: submittedQuestions.filter((q) => q.correct).length,
            total: submittedQuestions.length,
            duration: Math.max(0, 300 - timeLeft),
            finishedBy: isTimeUp ? "timeup" : "completed",
        };

        console.log("📝 New daily record:", record);

        all[todayKey].push(record);

        localStorage.setItem("brainloop-daily-history", JSON.stringify(all));

        console.log(
            "📌 SAVED DAILY HISTORY:",
            JSON.parse(localStorage.getItem("brainloop-daily-history") || "{}")
        );
    }, [isFinished]);



    function checkAnswer(userAnswer: string, correctAnswer: string) {
        return isAnswerCorrect(userAnswer, correctAnswer);
}

    /* -------------------------------------------
       🎯 SUBMIT HANDLER
    ------------------------------------------- */
    function handleSubmit() {
        if (!questions[currentIndex]) return;

        const q = questions[currentIndex];
        const expected = (q.answer ?? q.a ?? "").trim().toLowerCase();

        const correct =
            checkAnswer(input.trim().toLowerCase(), expected);

        if (correct) {
            showBalloons();
        } else {
            playWrongSound();
        }

        setSubmittedQuestions((prev) => [...prev, { q, userAnswer: input, correct }]);

        setFade(false);
        setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setInput("");
            setFade(true);
        }, 150);
    }

    /* -------------------------------------------
       🎨 RENDER UI
    ------------------------------------------- */

    if (!loaded) return <div className="text-center p-10 text-xl">Loading questions…</div>;

    const currentQuestion = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <div className="w-full max-w-2xl flex flex-col gap-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold capitalize">{topic} Quiz</h2>
                <button onClick={onExit} className="underline">Change Topic</button>
            </div>

            {/* Timer */}
            <div className="text-2xl font-bold">⏳ {minutes}:{seconds}</div>

            {/* Previous Answers */}
            {/* Previous Answers */}
            {submittedQuestions.map((entry, i) => (
                <div
                    key={i}
                    className={`p-5 rounded-xl shadow-md border-2 mb-4 ${entry.correct
                        ? "bg-green-100 border-green-400"
                        : "bg-red-100 border-red-400"
                        }`}
                >
                    {/* Question */}
                    <p className="text-lg font-bold text-gray-900">
                        Q{i + 1}: {entry.q.text ?? entry.q.q}
                    </p>

                    {/* User Answer */}
                    <p className="mt-1 text-gray-800 text-base">
                        Your answer:{" "}
                        <span
                            className={`font-bold ${entry.correct ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            {entry.userAnswer}
                        </span>
                    </p>

                    {/* Correct Answer */}
                    {!entry.correct && (
                        <p className="mt-1 text-base text-gray-900">
                            Correct answer:{" "}
                            <span className="font-bold text-green-700">
                                {entry.q.answer ?? entry.q.a}
                            </span>
                        </p>
                    )}
                </div>
            ))}


            {/* Current Question */}
            {!isFinished && (
                <div className={`p-6 rounded-xl transition-opacity ${fade ? "opacity-100" : "opacity-0"}`}>
                    {currentQuestion?.passage && (
                        <div className="mb-4 p-4 bg-teal-50 rounded-xl whitespace-pre-line">
                            {currentQuestion.passage}
                        </div>
                    )}

                    <p className="text-2xl font-semibold mb-4">
                        {currentQuestion?.q ?? currentQuestion?.text}
                    </p>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="border p-3 rounded-lg w-full"
                        placeholder="Type your answer..."
                        autoFocus
                        lang={category === "hindi" || topic === "hindi" ? "hi" : "en"}
                        inputMode={category === "hindi" || topic === "hindi" ? "text" : "latin"}
                    />

                    <button onClick={handleSubmit} className="px-6 py-3 bg-indigo-600 text-white rounded-xl mt-4">
                        Submit
                    </button>
                </div>
            )}

            {/* Quiz Finished */}
            {isFinished && (
                <div className="text-center py-8">
                    {isTimeUp ? (
                        <h2 className="text-3xl font-bold text-red-500">⏳ Time’s Up!</h2>
                    ) : (
                        <h2 className="text-3xl font-bold text-indigo-600">🎉 Quiz Complete!</h2>
                    )}

                    <p className="text-xl">
                        Score: <b>{correctCount}/{totalQuestions}</b>
                    </p>

                    {!isTimeUp && (
                        <p className="text-lg mt-2">Time Taken: {minutesTaken}:{secondsTaken}</p>
                    )}

                    <button
                        onClick={onExit}
                        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl"
                    >
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
}