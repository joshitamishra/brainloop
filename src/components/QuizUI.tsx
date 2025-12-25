"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { isAnswerCorrect } from "@/lib/normalise";
import { engToHindi } from "@/lib/hindiTranslit";

type Option = {
    id: string;
    label: string;
};

type Question = {
    text?: string;
    q?: string;
    answer?: string;
    a?: string;
    passage?: string;
    options?: Option[]; // ✅ NEW
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
    audio.volume = 0.5;
    audio.play().catch(() => { });
}

export default function QuizUI({
    topic,
    category,
    userName,
    onExit,
}: {
    topic: string;
    category?: string | null;
    userName?: string | null;
    onExit: () => void;
}) {
    /* -------------------------------------------
       ⏱ STATE
    ------------------------------------------- */
    const [timeLeft, setTimeLeft] = useState(300);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState("");
    const [submittedQuestions, setSubmittedQuestions] = useState<
        { q: Question; userAnswer: string; correct: boolean }[]
    >([]);
    const [fade, setFade] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loaded, setLoaded] = useState(false);

    /* -------------------------------------------
       🔊 WRONG SOUND
    ------------------------------------------- */
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        wrongSoundRef.current = new Audio("/sounds/pew_pew.mp3");
        wrongSoundRef.current.volume = 0.7;
    }, []);

    function playWrongSound() {
        const audio = wrongSoundRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    /* -------------------------------------------
       📥 LOAD QUESTIONS
    ------------------------------------------- */
    useEffect(() => {
        const saved = sessionStorage.getItem("currentSessionQuestions");
        if (saved && saved !== "undefined" && saved !== "null") {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setQuestions(parsed);
            } catch { }
        }
        setLoaded(true);
    }, []);

    /* -------------------------------------------
       ⏱ TIMER
    ------------------------------------------- */
    useEffect(() => {
        if (!loaded || timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft, loaded]);

    const isFinished = loaded && (currentIndex >= questions.length || timeLeft <= 0);
    const isTimeUp = loaded && timeLeft <= 0;

    const totalQuestions = questions.length;
    const correctCount = submittedQuestions.filter((q) => q.correct).length;

    /* -------------------------------------------
       🎯 ANSWER CHECK
    ------------------------------------------- */
    function handleSubmit(selectedAnswer?: string) {
        if (!questions[currentIndex]) return;

        const q = questions[currentIndex];
        const userAnswer = (selectedAnswer ?? input).trim().toLowerCase();
        const expected = (q.answer ?? q.a ?? "").trim().toLowerCase();

        const correct = isAnswerCorrect(userAnswer, expected);

        correct ? showBalloons() : playWrongSound();

        setSubmittedQuestions((prev) => [...prev, { q, userAnswer, correct }]);

        setFade(false);
        setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setInput("");
            setFade(true);
        }, 150);
    }

    /* -------------------------------------------
       🎨 RENDER
    ------------------------------------------- */
    if (!loaded) return <div className="p-10">Loading questions…</div>;

    const currentQuestion = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    return (
        <div className="w-full max-w-2xl flex flex-col gap-8 animate-fadeIn">

            {/* User Name (Top Left) */}
            {userName && (
                <div className="text-sm font-medium text-gray-400">
                    {userName}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold capitalize">{topic} Quiz</h2>
                <button onClick={onExit} className="underline">Change Topic</button>
            </div>

            {/* Timer */}
            <div className="text-2xl font-bold">⏳ {minutes}:{seconds}</div>

            {/* Previous Answers */}
            {submittedQuestions.map((entry, i) => (
                <div
                    key={i}
                    className={`rounded-xl p-4 mb-4 border ${entry.correct
                        ? "bg-green-900/20 border-green-600"
                        : "bg-red-900/20 border-red-600"
                        }`}
                >
                    <p className="text-lg font-semibold text-white mb-1">
                        {entry.correct ? "✅" : "❌"} Q{i + 1}: {entry.q.q ?? entry.q.text}
                    </p>

                    <p className="text-sm text-gray-300">
                        Your answer:{" "}
                        <span className={entry.correct ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                            {entry.userAnswer || "—"}
                        </span>
                    </p>

                    {!entry.correct && (
                        <p className="text-sm text-gray-300 mt-1">
                            Correct answer:{" "}
                            <span className="text-green-400 font-bold">
                                {entry.q.answer ?? entry.q.a}
                            </span>
                        </p>
                    )}
                </div>
            ))}

            {/* Current Question */}
            {!isFinished && (
                <div className={`p-6 rounded-xl transition-opacity ${fade ? "opacity-100" : "opacity-0"}`}>

                    {/* Passage */}
                    {currentQuestion?.passage && (
                        <div className="mb-6 p-6 rounded-xl bg-[#161618] border border-[#2d2d30] text-white whitespace-pre-line">
                            {currentQuestion.passage}
                        </div>
                    )}

                    {/* Question */}
                    <p className="text-2xl font-semibold mb-6">
                        {currentQuestion?.q ?? currentQuestion?.text}
                    </p>

                    {/* 🧒 OPTION MODE (Kids) */}
                    {currentQuestion?.options ? (
                        <div className="grid grid-cols-2 gap-6">
                            {currentQuestion.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSubmit(opt.id)}
                                    className="
                                        p-8 text-4xl font-bold rounded-2xl
                                        bg-indigo-100 text-indigo-900
                                        hover:bg-indigo-200 active:scale-95
                                        transition
                                    "
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* ✍️ TEXT INPUT MODE */
                        <>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className="border p-3 rounded-lg w-full"
                                placeholder="Type your answer..."
                                autoFocus
                            />

                            <button
                                onClick={() => handleSubmit()}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl mt-4"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Finished */}
            {isFinished && (
                <div className="text-center py-8">
                    <h2 className="text-3xl font-bold">
                        {isTimeUp ? "⏳ Time’s Up!" : "🎉 Quiz Complete!"}
                    </h2>
                    <p className="text-xl mt-2">
                        Score: <b>{correctCount}/{totalQuestions}</b>
                    </p>
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