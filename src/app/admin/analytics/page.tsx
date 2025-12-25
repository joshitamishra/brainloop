"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
    summary: {
        total_users?: number;
        active_users?: number;
        total_visits?: number;
        unique_locations?: number;
        total_visit_days?: number;
        last_visit?: string;
    };
    topLocations: Array<{
        location: string;
        total_visits: number;
        unique_users: number;
    }>;
    dailyStats: Array<{
        date: string;
        visits: number;
        unique_visitors: number;
    }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        fetchAnalytics();
    }, [days]);

    async function fetchAnalytics() {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics?days=${days}`);
            const result = await res.json();
            if (result.ok) {
                setData(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto" />
                <p className="mt-4 text-gray-400">Loading analytics...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-10 text-center text-red-400">
                Failed to load analytics data
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
                >
                    <option value={1}>Last 1 day</option>
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Users</h3>
                    <p className="text-2xl font-bold">{data.summary.total_users || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Users</h3>
                    <p className="text-2xl font-bold">{data.summary.active_users || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Visits</h3>
                    <p className="text-2xl font-bold">{data.summary.total_visits || 0}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Unique Locations</h3>
                    <p className="text-2xl font-bold">{data.summary.unique_locations || 0}</p>
                </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Top Locations</h2>
                <div className="space-y-2">
                    {data.topLocations.length > 0 ? (
                        data.topLocations.map((loc, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded"
                            >
                                <span className="font-medium">{loc.location}</span>
                                <div className="flex gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {loc.unique_users} users
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {loc.total_visits} visits
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No location data available</p>
                    )}
                </div>
            </div>

            {/* Daily Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Daily Statistics</h2>
                <div className="space-y-2">
                    {data.dailyStats.length > 0 ? (
                        data.dailyStats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded"
                            >
                                <span className="font-medium">
                                    {new Date(stat.date).toLocaleDateString()}
                                </span>
                                <div className="flex gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {stat.unique_visitors} visitors
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {stat.visits} visits
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No daily statistics available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

