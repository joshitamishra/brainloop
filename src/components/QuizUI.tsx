"use client";

import { useEffect, useState } from "react";

type Question = {
    text: string;
    answer: string;
};

const algebraQuestions: Question[] = [
    { text: "What is 2 + 3?", answer: "5" },
    { text: "Solve for x: x + 4 = 9", answer: "5" },
    { text: "What is 3 × 4?", answer: "12" },
    { text: "Simplify: 10 - 6", answer: "4" },
    { text: "Solve: 2x = 8", answer: "4" },
    { text: "What is 15 ÷ 3?", answer: "5" },
    { text: "Simplify: 7 + 2", answer: "9" },
    { text: "What is 6 × 2?", answer: "12" },
    { text: "Solve: x - 3 = 2", answer: "5" },
    { text: "Simplify: 9 - 1", answer: "8" },
];

export default function QuizUI({
    topic,
    onExit,
}: {
    topic: string;
    onExit: () => void;
}) {
    const [timeLeft, setTimeLeft] = useState(600); // 10 min countdown (600 sec)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState("");
    const [submittedQuestions, setSubmittedQuestions] = useState<
        { q: Question; userAnswer: string; correct: boolean }[]
    >([]);
    const [fade, setFade] = useState(true);

    const isFinished =
        currentIndex >= algebraQuestions.length || timeLeft <= 0;
    const currentQuestion = !isFinished ? algebraQuestions[currentIndex] : null;

    // ---------------------
    // TIMER
    // ---------------------
    useEffect(() => {
        if (timeLeft <= 0) return;

        const t = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(t);
    }, [timeLeft]);

    // ---------------------
    // SAVE HISTORY WHEN FINISHED
    // ---------------------
    useEffect(() => {
        if (!isFinished) return;

        const history = JSON.parse(localStorage.getItem("brainloop-history") || "[]");

        history.push({
            timestamp: Date.now(),
            topic,
            answers: submittedQuestions,
            duration: 600 - timeLeft,
        });

        localStorage.setItem("brainloop-history", JSON.stringify(history));
    }, [isFinished]);

    // ---------------------
    // HANDLE SUBMIT
    // ---------------------
    function handleSubmit() {
        const q = algebraQuestions[currentIndex];
        const correct = input.trim() === q.answer.trim();

        setSubmittedQuestions([
            ...submittedQuestions,
            { q, userAnswer: input, correct },
        ]);

        // fade animation
        setFade(false);
        setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
            setInput("");
            setFade(true);
        }, 150);
    }

    // ---------------------
    // FORMAT TIMER
    // ---------------------
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    const timerColor =
        timeLeft < 60
            ? "text-red-600 dark:text-red-400"
            : "text-indigo-700 dark:text-indigo-300";

    return (
        <div className="w-full max-w-2xl flex flex-col gap-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 capitalize">
                    {topic} Quiz
                </h2>

                <button
                    onClick={onExit}
                    className="text-indigo-600 dark:text-indigo-300 underline hover:opacity-80"
                >
                    Change Topic
                </button>
            </div>

            {/* Countdown */}
            <div className={`text-2xl font-bold ${timerColor}`}>
                ⏳ {minutes}:{seconds}
            </div>

            {/* Previous Questions */}
            <div className="flex flex-col gap-6">
                {submittedQuestions.map((entry, i) => (
                    <div
                        key={i}
                        className={`p-5 rounded-xl shadow-lg border transition-all duration-300 ${entry.correct
                                ? "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700"
                                : "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700"
                            }`}
                    >
                        <p className="text-lg font-medium dark:text-gray-200">
                            Q{i + 1}: {entry.q.text}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                            Your answer:{" "}
                            <span
                                className={`font-semibold ${entry.correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                                    }`}
                            >
                                {entry.userAnswer}
                            </span>
                        </p>
                        {!entry.correct && (
                            <p className="text-gray-700 dark:text-gray-300">
                                Correct answer: <strong>{entry.q.answer}</strong>
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Current Question */}
            {!isFinished && (
                <div
                    className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {currentQuestion?.text}
                    </p>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border p-3 rounded-lg w-full text-lg mb-4 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Type your answer..."
                    />

                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition duration-150 shadow-md"
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Finished */}
            {isFinished && (
                <div className="text-center text-2xl font-semibold text-indigo-700 dark:text-indigo-300 py-8 animate-fadeIn">
                    🎉 Quiz Complete!
                </div>
            )}
        </div>
    );
}
