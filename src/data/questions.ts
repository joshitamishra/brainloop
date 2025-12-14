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

    veda:{
        label: "Veda",
        topics: {
            ramayana: {
                label: "    ",
                questions: [
                    "What is the meaning of the word 'ramayana'?",
                ],
            },
            mahabharata: {
                label: "Mahabharata",
                questions: [
                    "What is the meaning of the word 'mahabharata'?",
                ],
            },
            vedas: {
                label: "Vedas",
                questions: [
                    "What is the meaning of the word 'vedas'?",
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
                label: "Geography",
                questions: [
                    { q: "Which is the largest continent in the world?", a: "Asia" },
                    { q: "What percentage of Earth's surface is covered by water?", a: "Approximately 71%" },
                    { q: "Which is the longest river in the world?", a: "The Nile River" },
                    { q: "Which is the largest ocean on Earth?", a: "Pacific Ocean" },
                    { q: "Which country has the largest population?", a: "China" },
                    { q: "What is the driest desert in the world?", a: "The Atacama Desert" },
                    { q: "Which mountain range contains Mount Everest?", a: "The Himalayas" },
                    { q: "Which layer of the Earth do we live on?", a: "The crust" },
                    { q: "What is the Earth’s largest island?", a: "Greenland" },
                    { q: "What is the capital of Japan?", a: "Tokyo" },
                    { q: "What is the capital of Australia?", a: "Canberra" },
                    { q: "What is the capital of Canada?", a: "Ottawa" },
                    { q: "What is the capital of Brazil?", a: "Brasília" },
                    { q: "What is the capital of India?", a: "New Delhi" },
                    { q: "Which two continents are entirely in the Southern Hemisphere?", a: "Australia and Antarctica" },
                    { q: "What is the term for a chain of islands?", a: "Archipelago" },
                    { q: "What is the capital of Germany?", a: "Berlin" },
                    { q: "What is the capital of the United Kingdom?", a: "London" },
                    { q: "What is the capital of China?", a: "Beijing" },
                    { q: "What is the capital of Mexico?", a: "Mexico City" },
                    { q: "What is the capital of Spain?", a: "Madrid" },
                    { q: "Which country has the most natural lakes?", a: "Canada" },
                    { q: "What is the capital of France?", a: "Paris" },
                    { q: "What is the capital of Italy?", a: "Rome" },
                    { q: "What is the deepest point in the ocean?", a: "The Mariana Trench" },
                    { q: "Which continent is also a country?", a: "Australia" },
                    { q: "What is the imaginary line that divides Earth into Northern and Southern hemispheres?", a: "The Equator" },
                    { q: "What is the capital of Russia?", a: "Moscow" },
                    { q: "What is the capital of Egypt?", a: "Cairo" },
                    { q: "What is the capital of South Africa?", a: "Pretoria" },
                    ]
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
                    { q: "Which Excel formula adds all numbers in the range A1 to A10?", a: "=SUM(A1:A10)" },
                    { q: "Which function returns the average of values in a range?", a: "=AVERAGE(range)" },
                    { q: "Which function returns the number of non-empty cells in a range?", a: "=COUNTA(range)" },
                    { q: "Which function returns the maximum value in a range?", a: "=MAX(range)" },
                    { q: "What formula finds the minimum value in a range?", a: "=MIN(range)" },
                    { q: "Which formula returns the number of cells containing numbers?", a: "=COUNT(range)" },
                    { q: "Which function looks up a value vertically in a table?", a: "=VLOOKUP(lookup_value, table_array, col_index, FALSE)" },
                    { q: "Which function finds text length in a cell?", a: "=LEN(cell)" },
                    { q: "Which formula joins text values together?", a: "=CONCAT(text1, text2, ...)" },
                    { q: "Which formula extracts the first 5 characters from A1?", a: "=LEFT(A1, 5)" },
                    { q: "Which formula extracts the last 4 characters from A1?", a: "=RIGHT(A1, 4)" },
                    { q: "Which Excel function returns the current date?", a: "=TODAY()" },
                    { q: "Which function replaces VLOOKUP with a more flexible search?", a: "=XLOOKUP(lookup, lookup_array, return_array)" },
                    { q: "Which function rounds a number in A1 to 2 decimal places?", a: "=ROUND(A1, 2)" },
                    { q: "Which function adds values that meet a condition?", a: "=SUMIF(range, criteria, sum_range)" }
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
        topics: {
            basic_math: {
                label: "Basic Math",
                questions: [
                    { q: "What is 10 ÷ 2?", a: "5" },
                    { q: "What is 12 ÷ 3?", a: "4" },
                    { q: "What is 15 ÷ 5?", a: "3" },
                    { q: "What is 16 ÷ 4?", a: "4" },
                    { q: "What is 18 ÷ 3?", a: "6" },

                    { q: "What is 20 ÷ 4?", a: "5" },
                    { q: "What is 14 ÷ 2?", a: "7" },
                    { q: "What is 9 ÷ 3?", a: "3" },
                    { q: "What is 21 ÷ 7?", a: "3" },
                    { q: "What is 24 ÷ 6?", a: "4" }
                ]
            },

            english: {
                label: "English",
                questions: [
                    { q: "Choose the conjunction: I wanted to play, ___ it started to rain.", a: "but" },
                    { q: "Fill in the blank with a conjunction: You can have tea ___ juice.", a: "or" },
                    { q: "Choose the conjunction: She was tired ___ she finished her homework.", a: "but" },
                    { q: "Fill in the blank: I will go to the park ___ my friend comes.", a: "if" },
                    { q: "Choose the conjunction: He is small ___ strong.", a: "but" },

                    { q: "Pick the noun: The dog chased the ball.", a: "dog" },
                    { q: "Choose the noun: The teacher wrote on the board.", a: "teacher" },
                    { q: "Fill in the blank with a noun: The ___ is barking loudly.", a: "dog" },
                    { q: "Pick the noun: The sun is shining brightly.", a: "sun" },
                    { q: "Choose the noun: The children played in the garden.", a: "children" }
                ]
            },

            hindi: {
                label: "Hindi",
                questions: [
                    { q: "‘आम’ किस प्रकार का फल है?", a: "मीठा फल" },
                    { q: "सूरज कहाँ उगता है?", a: "पूर्व दिशा में" },
                    { q: "‘कुत्ता’ किसका नाम है?", a: "जानवर" },
                    { q: "‘घर’ का विलोम क्या है?", a: "बाहर" },
                    { q: "‘बड़ा’ का समानार्थी शब्द?", a: "विशाल" },
                    { q: "भारत की राजधानी क्या है?", a: "नई दिल्ली" },
                    { q: "‘लाल’ किस रंग का नाम है?", a: "लाल रंग" },
                    { q: "‘गाय’ क्या देती है?", a: "दूध" },
                    { q: "‘जल’ का अर्थ क्या है?", a: "पानी" },
                    { q: "‘खुश’ का विलोम क्या है?", a: "दुखी" }
                ]
            },

            science: {
                label: "Science",
                questions: [
                    { q: "What do we call animals that eat only plants?", a: "Herbivores" },
                    { q: "What do we call animals that eat only meat?", a: "Carnivores" },
                    { q: "What do we call animals that eat both plants and meat?", a: "Omnivores" },
                    { q: "Which body part do birds use to fly?", a: "Wings" },
                    { q: "Where do fish live?", a: "In water" },
                    { q: "What helps a fish breathe in water?", a: "Gills" },
                    { q: "Which animal is known as the king of the jungle?", a: "Lion" },
                    { q: "What is a baby dog called?", a: "Puppy" },
                    { q: "What is a baby cat called?", a: "Kitten" },
                    { q: "What is a baby cow called?", a: "Calf" },
                    { q: "Name one animal that can fly.", a: "Bird" },
                    { q: "Name one animal that lives in the Arctic with thick fur.", a: "Polar bear" },
                    { q: "Which animal has a long trunk?", a: "Elephant" },
                    { q: "Which animal carries its baby in a pouch?", a: "Kangaroo" },
                    { q: "What do we call animals that live on farms?", a: "Farm animals" }
                ]
            },

            reading: {
                label: "Reading Comprehension",
                questions: [
                    {
                        passage: "Riya discovered a shimmering blue seashell along the shore.\nShe examined its smooth surface carefully.\nGentle waves rolled in and brushed against her sandals.\nRiya tucked the seashell safely into her pocket, feeling delighted.",
                        q: "What did Riya discover?",
                        a: "A blue seashell"
                    },
                    {
                        passage: "A tiny sparrow perched on the branch outside Noah’s window.\nEach morning, it sang a soft, cheerful melody.\nNoah listened patiently, enjoying the peaceful tune.\nHe looked forward to hearing the sparrow every day.",
                        q: "What bird sat outside Noah’s window?",
                        a: "A sparrow"
                    },
                    {
                        passage: "Sara prepared a batch of chocolate cookies with her mother.\nThey carefully measured the ingredients and stirred the mixture.\nSoon, a warm and comforting aroma filled the kitchen.\nSara eagerly waited for the freshly baked cookies to cool.",
                        q: "What was Sara making?",
                        a: "Chocolate cookies"
                    },
                    {
                        passage: "Leo created a detailed drawing of a rainbow using his crayons.\nHe blended the colors to make each stripe appear bright and vivid.\nHis teacher admired the artwork and praised his effort.\nLeo felt a strong sense of pride in his colorful masterpiece.",
                        q: "What did Leo draw?",
                        a: "A rainbow"
                    },
                    {
                        passage: "A playful puppy dashed around the yard chasing its own tail.\nIt spun in quick circles, becoming dizzy and excited.\nEmma couldn’t stop laughing as she watched its silly antics.\nEventually, the puppy lay down, panting but satisfied.",
                        q: "What was the puppy chasing?",
                        a: "Its tail"
                    }
                ]
            }
        }
    }
} as const;