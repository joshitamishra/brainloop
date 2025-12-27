"use client";

import { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts";
import {
    Brain, Target, Clock, TrendingUp, Award,
    ChevronRight, RefreshCcw, Sparkles, AlertCircle
} from "lucide-react";

interface QuizResult {
    id: number;
    category: string;
    topic: string;
    score: number;
    total_questions: number;
    time_taken_seconds: number;
    completed_at: string;
}

interface AIAnalysis {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    interests?: string[];
    persona?: string;
}

export default function ProgressPage() {
    const [history, setHistory] = useState<QuizResult[]>([]);
    const [totalUsage, setTotalUsage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [activeTab, setActiveTab] = useState<"standard" | "primary">("standard");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/quiz/history");
            const data = await res.json();
            if (data.history) {
                setHistory(data.history);
                setTotalUsage(data.totalUsage || 0);
                // Auto-analyze
                runAIAnalysis(data.history);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoading(false);
        }
    };

    const runAIAnalysis = async (data: QuizResult[]) => {
        setAnalyzing(true);
        // Filter history for AI based on active tab
        const filteredForAI = data.filter(item =>
            activeTab === "primary" ? item.category === "primary" : item.category !== "primary"
        );

        try {
            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: filteredForAI })
            });
            const result = await res.json();

            if (result.analysis) {
                setAnalysis(result.analysis);
            } else if (result.error) {
                setAnalysis({
                    summary: `Analysis Error: ${result.error}`,
                    strengths: ["N/A"],
                    weaknesses: ["N/A"],
                    recommendation: "Please check your API configuration."
                });
            }
        } catch (err) {
            console.error("AI Analysis failed:", err);
            setAnalysis({
                summary: "Connection failed. Could not reach the AI Coach.",
                strengths: ["N/A"],
                weaknesses: ["N/A"],
                recommendation: "Try again in a few moments."
            });
        } finally {
            setAnalyzing(false);
        }
    };

    // Re-run analysis when tab changes
    useEffect(() => {
        if (history.length > 0) {
            runAIAnalysis(history);
        }
    }, [activeTab]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f11]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Filter history based on tab
    const filteredHistory = history.filter(item =>
        activeTab === "primary" ? item.category === "primary" : item.category !== "primary"
    );

    // Stats calculations for filtered data
    const totalQuizzes = filteredHistory.length;
    const avgScore = totalQuizzes > 0
        ? Math.round((filteredHistory.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0) / totalQuizzes) * 100)
        : 0;
    const totalTime = Math.round(filteredHistory.reduce((acc, curr) => acc + curr.time_taken_seconds, 0) / 60);

    // Chart data
    const chartData = [...filteredHistory].reverse().map(item => ({
        date: new Date(item.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: Math.round((item.score / item.total_questions) * 100),
        topic: item.topic
    }));

    return (
        <div className="min-h-screen bg-[#0f0f11] text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            Performance Analysis
                        </h1>
                        <p className="text-gray-400 mt-2">Track your learning journey and get AI-driven insights.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-[#161618] p-1 rounded-xl border border-[#2d2d30]">
                        <button
                            onClick={() => setActiveTab("standard")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "standard" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            High School
                        </button>
                        <button
                            onClick={() => setActiveTab("primary")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "primary" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            Primary
                        </button>
                    </div>

                    <button
                        onClick={() => runAIAnalysis(history)}
                        disabled={analyzing || totalQuizzes === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-[#161618] hover:bg-[#1c1c1f] border border-[#2d2d30] disabled:opacity-50 rounded-lg transition-all"
                    >
                        {analyzing ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                        {analyzing ? "Analyzing..." : "Refresh AI Insights"}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        icon={<RefreshCcw className="text-orange-400" />}
                        label="Total Visits"
                        value={totalUsage.toString()}
                        sub="Website usage count"
                    />
                    <StatCard
                        icon={<Target className="text-blue-400" />}
                        label="Quizzes Done"
                        value={totalQuizzes.toString()}
                        sub={`${activeTab === "primary" ? "Primary" : "High School"} sessions`}
                    />
                    <StatCard
                        icon={<TrendingUp className="text-green-400" />}
                        label="Avg Accuracy"
                        value={`${avgScore}%`}
                        sub="Correct answers rate"
                    />
                    <StatCard
                        icon={<Clock className="text-purple-400" />}
                        label="Time Spent"
                        value={`${totalTime}m`}
                        sub="Total minutes active"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#161618] border border-[#2d2d30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                Score Progress
                            </h3>
                            <div className="h-[300px] w-full">
                                {totalQuizzes > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d30" vertical={false} />
                                            <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#161618', border: '1px solid #2d2d30', borderRadius: '8px' }}
                                                itemStyle={{ color: '#a855f7' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#a855f7"
                                                strokeWidth={3}
                                                dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                        <p>No data yet. Complete a quiz to see progress!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#161618] border border-[#2d2d30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {filteredHistory.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-[#1c1c1f] rounded-xl border border-[#2d2d30] hover:border-purple-500/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <Brain className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{item.topic}</h4>
                                                <p className="text-xs text-gray-500">{new Date(item.completed_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-400">{item.score}/{item.total_questions}</div>
                                            <div className="text-xs text-gray-500">{Math.round((item.score / item.total_questions) * 100)}%</div>
                                        </div>
                                    </div>
                                ))}
                                {totalQuizzes === 0 && <p className="text-center text-gray-500 py-4">No recent activity.</p>}
                            </div>
                        </div>
                    </div>

                    {/* AI Insights Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-20 h-20" />
                            </div>

                            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Brain className="text-purple-400" />
                                    AI Coach
                                </div>
                                {analysis?.persona && (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 uppercase tracking-tighter">
                                        {analysis.persona}
                                    </span>
                                )}
                            </h3>

                            {analyzing ? (
                                <div className="space-y-4 py-8">
                                    <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
                                    <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                                </div>
                            ) : analysis ? (
                                <div className="space-y-6">
                                    <p className="text-gray-300 leading-relaxed italic">
                                        "{analysis.summary}"
                                    </p>

                                    {analysis.interests && analysis.interests.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">Detected Interests</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.interests.map((i: string) => (
                                                    <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-md border border-orange-500/20">
                                                        {i}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Strengths</h4>
                                            <ul className="space-y-2">
                                                {analysis.strengths.map(s => (
                                                    <li key={s} className="text-xs text-gray-400 flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Focus Areas</h4>
                                            <ul className="space-y-2">
                                                {analysis.weaknesses.map(w => (
                                                    <li key={w} className="text-xs text-gray-400 flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-yellow-400" />
                                            Golden Tip
                                        </h4>
                                        <p className="text-sm text-gray-400">{analysis.recommendation}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 text-sm">Click refresh to generate your personalized learning plan.</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-[#161618] border border-[#2d2d30] rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Study Tip</h3>
                            <p className="text-sm text-gray-400 italic">
                                "Spaced repetition is key. Try revisiting topics you struggled with 2 days after your first attempt."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
    return (
        <div className="bg-[#161618] border border-[#2d2d30] p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-gray-400 font-medium">{label}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-xs text-gray-500">{sub}</div>
        </div>
    );
}
