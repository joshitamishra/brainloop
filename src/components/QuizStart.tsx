"use client";
import { useRouter } from "next/navigation";


export default function QuizStart({ topic }: { topic: string }) {
    const router = useRouter();


    return (
        <div className="flex flex-col items-center justify-center w-full gap-6 p-6">
            <h1 className="text-3xl font-semibold capitalize">{topic}</h1>
            <p className="text-lg text-gray-700 max-w-lg text-center">
                You will get simple revision questions on the topic you choose. The session lasts 10 minutes.
            </p>
            <button
                onClick={() => router.push(`/quiz/${topic}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition shadow"
            >
                Start Quiz
            </button>
        </div>
    );
}