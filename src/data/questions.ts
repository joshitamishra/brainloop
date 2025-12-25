export const QUESTION_BANK = {
    math: {
        label: "Math",
        topics: {
            algebra: {
                label: "Algebra",
                questions: [
                    "What is the value of 3x when x = 4?",
                    "Simplify: 2(x + 5) - 3",
                    "Solve for x: x + 7 = 15",
                    "What is 12 divided by 3?",
                    "Simplify: 5x - 2x",
                ],
            },

            geometry: {
                label: "Geometry",
                questions: [
                    "What is the sum of angles in a triangle?",
                    "Find the perimeter of a square with side 6.",
                    "What is the area of a right triangle with legs 3 and 4?",
                    "Name the shape with 5 sides.",
                    "Define a radius of a circle.",
                ],
            },

            calculus: {
                label: "Calculus",
                questions: [
                    "What is the derivative of x²?",
                    "What is the integral of 2x dx?",
                    "Define a limit in calculus.",
                    "What is the derivative of sin(x)?",
                    "What does ∫ symbol represent?",
                ],
            },

            trigonometry: {
                label: "Trigonometry",
                questions: [
                    "What is sin(30°)?",
                    "What is cos(60°)?",
                    "State the Pythagorean identity.",
                    "Convert 45° to radians.",
                    "Find tan(45°).",
                ],
            },
        },
    },

    // GK BLOCK
    gk: {
        label: "GK",
        topics: {
            current_affairs: {
                label: "Current Affairs",
                questions: [
                    { q: "Who is the current Prime Minister of India?", a: "Narendra Modi" },
                    { q: "Who is the President of India as of 2025?", a: "Droupadi Murmu" },
                    { q: "Which country became India's largest trading partner in 2024–2025?", a: "The United States" },
                    { q: "Which Indian city hosted the Vibrant Gujarat Global Summit 2025?", a: "Gandhinagar" },
                    { q: "What is India's rank in the Global Startup Ecosystem Index 2024?", a: "3rd" },
                    { q: "Which Indian space mission focused on sun observation in 2024–2025?", a: "Aditya-L1" },
                    { q: "Which Indian company became the most valuable by market capitalization in 2025?", a: "Reliance Industries" },
                    { q: "Which state became the first to achieve 100% EV (electric vehicle) public transport in 2025?", a: "Delhi" },
                    { q: "What is the name of India's digital public health mission?", a: "Ayushman Bharat Digital Mission (ABDM)" },
                    { q: "Which metro project became operational in 2025 covering India's longest underground stretch?", a: "Delhi Metro Phase 4" },
                    { q: "Which Indian film won an international award at the 2025 Golden Globes?", a: "Definition varies yearly — typically the winning Indian entry (e.g., 'RRR' era). For quiz consistency: 'India’s official entry film won Best International Feature nomination.'" },
                    { q: "Which Indian state remained the highest GDP contributor in 2024–2025?", a: "Maharashtra" },
                    { q: "What was India’s approximate GDP growth rate for FY 2024–25?", a: "Around 6.5%–7%" },
                    { q: "Which mobile technology generation did India begin wide-scale rollout for in 2024–2025?", a: "6G pilots and early trials" },
                    { q: "Which Indian airport became the world’s busiest single-runway airport in 2024?", a: "Mumbai's Chhatrapati Shivaji Maharaj International Airport" }
                ],
            },
            geography: {
                label: "Geography"
            },
        },
    },

    computer: {
        label: "Computer",
        topics: {
            linux_commands: {
                label: "Linux Commands",
                questions: [
                    { q: "Which command lists all files, including hidden ones?", a: "ls -a" },
                    { q: "Which command shows the full file system path of the current directory?", a: "pwd" },
                    { q: "Which command is used to copy files in Linux?", a: "cp" },
                    { q: "Which command moves or renames files?", a: "mv" },
                    { q: "What command displays the last 20 lines of a file?", a: "tail -20" },
                    { q: "Which command shows running processes in a tree format?", a: "pstree" },
                    { q: "What command is used to change file permissions?", a: "chmod" },
                    { q: "Which command searches for text within files?", a: "grep" },
                    { q: "Which command shows disk usage of a directory?", a: "du -h" },
                    { q: "What command gives free and used memory details?", a: "free -h" },
                    { q: "Which command shows currently logged-in users?", a: "who" },
                    { q: "Which command creates an empty file?", a: "touch" },
                    { q: "What command extracts files from a tar archive?", a: "tar -xvf" },
                    { q: "Which command displays network interface information?", a: "ifconfig" },
                    { q: "Which command finds files by name?", a: "find /path -name 'filename'" }
                ],
            },
            microsoft_excel: {
                label: "Microsoft Excel",
                questions: [
                    { q: "Which function adds numbers?", a: "SUM" },

                    { q: "Which function calculates average?", a: "AVERAGE" },

                    { q: "Which function counts numeric cells?", a: "COUNT" },

                    { q: "Which function counts non-empty cells?", a: "COUNTA" },

                    { q: "Which function finds highest value?", a: "MAX" },

                    { q: "Which function finds lowest value?", a: "MIN" },

                    { q: "Which function applies a condition?", a: "IF" },

                    { q: "Which function removes extra spaces?", a: "TRIM" },

                    { q: "Which function returns text length?", a: "LEN" },

                    { q: "Which function joins text values?", a: "CONCAT" },

                    { q: "Which function replaces VLOOKUP?", a: "XLOOKUP" },

                    { q: "Which function performs vertical lookup?", a: "VLOOKUP" },

                    { q: "Which function returns today date?", a: "TODAY" },

                    { q: "Which function rounds numbers?", a: "ROUND" },

                    { q: "Which function sums by condition?", a: "SUMIF" }
              ],
            },
        }
    },

    physics: {
        label: "Physics",
        topics: {
            mechanics: {
                label: "Mechanics",
                questions: [
                    "What is Newton’s second law?",
                    "Define velocity.",
                    "What is the unit of force?",
                    "What is gravitational acceleration on Earth?",
                    "What does inertia mean?",
                ],
            },

            optics: {
                label: "Optics",
                questions: [
                    "What is the speed of light?",
                    "Define reflection.",
                    "What is refraction?",
                    "What does a convex lens do?",
                    "State Snell’s law.",
                ],
            },
        },
    },

    chemistry: {
        label: "Chemistry",
        topics: {
            periodic_table: {
                label: "Periodic Table",
                questions: [
                    { q: "Which element has the highest electronegativity in the periodic table?", a: "Fluorine" },

                    { q: "What is the electron configuration of the element with atomic number 26?", a: "1s2 2s2 2p6 3s2 3p6 4s2 3d6" },

                    { q: "Which group does the element with the configuration [Kr] 5s2 4d10 5p5 belong to?", a: "Group 17" },

                    { q: "Which alkali metal is the most reactive in Group 1?", a: "Francium" },

                    { q: "Which element in Period 3 has the largest atomic radius?", a: "Sodium" },

                    { q: "Which block does the element with atomic number 48 belong to?", a: "d-block" },

                    { q: "Which noble gas has the lowest atomic mass?", a: "Helium" },

                    { q: "Which element forms a +2 ion and contains 24 protons?", a: "Chromium" },

                    { q: "Which periodic property increases from left to right across a period?", a: "Electronegativity" },

                    { q: "What determines the chemical properties of an element according to modern periodic law?", a: "Atomic number" }
                ]

            }
        },
    },
        primary: {
            label: "PRIMARY BLOCK",
            ageGroups: {
                "4-6": {
                    label: "4–6 Years",
                    topics: {
                        basic_math: {
                            label: "Math",
                            route: "/primary/4-6/basic-math",
                            type: "quiz"
                        },
                        english: {
                            label: "English",
                            route: "/primary/4-6/english",
                            type: "quiz"
                        },
                        science: {
                            label: "Science",
                            route: "/primary/4-6/science",
                            type: "quiz"
                        },
                        reading: {
                            label: "Reading Comprehension",
                            route: "/primary/4-6/reading",
                            type: "quiz"
                        },
                        shlok: {
                            label: "Shlok",
                            route: "/primary/4-6/shlok",
                            type: "content"
                        }
                    }
                },

                "6-8": {
                    label: "6–8 Years",
                    topics: {
                        basic_math: {
                            label: "Basic Math",
                            route: "/primary/6-8/basic-math",
                            type: "quiz"
                        },
                        english: {
                            label: "English",
                            route: "/primary/6-8/english",
                            type: "quiz"
                        },
                        science: {
                            label: "Science",
                            route: "/primary/6-8/science",
                            type: "quiz"
                        },
                        reading: {
                            label: "Reading Comprehension",
                            route: "/primary/6-8/reading",
                            type: "quiz"
                        },
                        shlok: {
                            label: "Shlok",
                            route: "/primary/6-8/shlok",
                            type: "content"
                        }
                    }
                }
        }
    },
} as const;