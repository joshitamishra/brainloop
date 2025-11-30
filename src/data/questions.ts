export const QUESTION_BANK = {
    math: {
        label: "Math",
        topics: {
            "basic-algebra": {
                label: "Basic Algebra",
                questions: [
                    "What is the value of 3x when x = 4?",
                    "Simplify: 2(x + 5) - 3",
                    "Solve for x: x + 7 = 15",
                    "What is 12 divided by 3?",
                    "Simplify: 5x - 2x",
                ],
            },

            fractions: {
                label: "Fractions",
                questions: [
                    "Simplify: 8/12",
                    "What is 1/2 + 1/3?",
                    "Convert 3/4 to a decimal.",
                    "What is 2/5 of 25?",
                    "Which fraction is larger: 3/7 or 4/9?",
                ],
            },

            percentages: {
                label: "Percentages",
                questions: [
                    "What is 20% of 150?",
                    "Convert 45% to a decimal.",
                    "Increase 80 by 10%.",
                    "What percent of 50 is 5?",
                    "A price increases from $100 to $130. What is the percent change?",
                ],
            },

            "Geometry-basics": {
                label: "Geometry Basics",
                questions: [
                    "What is the sum of angles in a triangle?",
                    "Find the perimeter of a square with side 6.",
                    "What is the area of a right triangle with legs 3 and 4?",
                    "Name the shape with 5 sides.",
                    "Define a radius of a circle.",
                ],
            },

            "Trigonometry-intro": {
                label: "Trigonometry Intro",
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
} as const;