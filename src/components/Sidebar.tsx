"use client";

import SidebarTopicLink from "@/components/SidebarTopicLink";
import UserPanel from "@/components/UserPanel";
import { QUESTION_BANK } from "@/data/questions";
import { TrendingUp } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen border-r border-[#2d2d30] bg-[#161618] p-6 overflow-y-auto">
            <div className="mb-8 border-b border-[#2d2d30] pb-4">
                <UserPanel />
            </div>

            <div className="mb-8">
                <SidebarTopicLink href="/progress">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span>AI Analysis</span>
                    </div>
                </SidebarTopicLink>
            </div>
            {Object.entries(QUESTION_BANK).map(([categoryKey, category]) => {
                // PRIMARY BLOCK (uses ageGroups)
                if (categoryKey === "primary") {
                    if (!category.ageGroups) return null;

                    return (
                        <div key={categoryKey} className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">
                                {category.label}
                            </h3>

                            {Object.entries(category.ageGroups).map(([ageKey, ageGroup]) => (
                                <div key={ageKey} className="mb-4 ml-2">
                                    <h4 className="text-xs text-gray-500 mb-2">
                                        {ageGroup.label}
                                    </h4>

                                    <div className="space-y-1">
                                        {Object.entries(ageGroup.topics ?? {}).map(([topicKey, topic]) => (
                                            <SidebarTopicLink
                                                key={topicKey}
                                                href={
                                                    "route" in topic && topic.route
                                                        ? topic.route
                                                        : `/quiz/start?category=primary&age=${ageKey}&topic=${topicKey}`
                                                }
                                            >
                                                {topic.label}
                                            </SidebarTopicLink>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }

                // NON-PRIMARY categories (old structure)
                if (!category.topics) return null;

                const isLocked = ["math", "physics", "chemistry"].includes(categoryKey);

                return (
                    <div key={categoryKey} className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">
                            {category.label}
                        </h3>

                        <div className="space-y-2">
                            {Object.entries(category.topics ?? {}).map(([topicKey, topic]) => (
                                <SidebarTopicLink
                                    key={topicKey}
                                    href={isLocked ? "/premium" : `/quiz/start?category=${categoryKey}&topic=${topicKey}`}
                                    locked={isLocked}
                                >
                                    {topic.label}
                                </SidebarTopicLink>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div className="mt-10 border-t border-[#2d2d30] pt-4">
                {/* UserPanel moved to top */}
            </div>
        </aside>
    );
}