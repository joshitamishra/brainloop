"use client";

import SidebarTopicLink from "@/components/SidebarTopicLink";
import UserPanel from "@/components/UserPanel";
import { QUESTION_BANK } from "@/data/questions-client";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen border-r border-[#2d2d30] bg-[#161618] p-6 overflow-y-auto">

            {Object.entries(QUESTION_BANK).map(([categoryKey, category]) => (
                <div key={categoryKey} className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 tracking-wider">
                        {category.label}
                    </h3>

                    <div className="space-y-2">
                        {Object.entries(category.topics).map(([topicKey, topic]) => (
                            <SidebarTopicLink
                                key={topicKey}
                                href={`/quiz/start?topic=${topicKey}&category=${categoryKey}`}
                            >
                                {topic.label}
                            </SidebarTopicLink>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-10 border-t border-[#2d2d30] pt-4">
                <UserPanel />
            </div>

        </aside>
    );
}