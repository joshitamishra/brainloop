"use client";

export const QUESTION_BANK = {
    math: {
        label: "Math",
        topics: {
            algebra: { label: "Algebra" },
            geometry: { label: "Geometry" },
            calculus: { label: "Calculus" },
            trigonometry: { label: "Trigonometry" }
        }
    },
    physics: {
        label: "Physics",
        topics: {
            mechanics: { label: "Mechanics" },
            optics: { label: "Optics" }
        }
    },
    chemistry: {
        label: "Chemistry",
        topics: {
            periodic_table: { label: "Periodic Table" },
        },
    },
    computer: {
        label: "Computer",
        topics: {
            linux_commands: { label: "Linux Commands" },
            microsoft_excel: { label: "Microsoft Excel" },
        },
    },
    gk: {
        label: "GK",
        topics: {
            current_affairs: { label: "Current Affairs" },
            geography: { label: "Geography" }
        },
    },
    primary: {
        label: "PRIMARY BLOCK",

        ageGroups: {
            "2-3": {
                label: "2–3 Years",
                topics: {
                    colors_and_shapes: {
                        label: "Colors & Shapes",
                        kind: "slideshow",
                        route: "/primary/2-3/colors_and_shapes"
                    }
                }
            },

            "4-6": {
                label: "4–6 Years",
                topics: {
                    basic_math: { label: "Basic Math" },
                    english: { label: "English" },
                    reading: { label: "Reading" },
                    shlok: {
                        label: "Shlok",
                        kind: "content",
                        route: "/primary/shlok"
                    }
                }
            },

            "6-8": {
                label: "6–8 Years",
                topics: {
                    basic_math: { label: "Basic Math" },
                    english: { label: "English" },
                    science: { label: "Science" },
                    reading: { label: "Reading Comprehension" },
                    shlok: {
                        label: "Shlok",
                        kind: "content",
                        route: "/primary/shlok"
                    }
                }
            }
        }
    },
};