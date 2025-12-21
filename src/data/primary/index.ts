import { questions as basicMath46 } from "./4-6/basic_math";
import { questions as english46 } from "./4-6/english";

import { questions as basicMath68 } from "./6-8/basic_math";
import { questions as english68 } from "./6-8/english";

export const PRIMARY_QUESTIONS = {
    "4-6": {
        basic_math: basicMath46,
        english: english46,
    },
    "6-8": {
        basic_math: basicMath68,
        english: english68,
    },
} as const;