// -------------------------------------------------------
//  PURE OFFLINE HINDI TRANSLITERATION ENGINE
//  Supports: vowels, consonants, matras, clusters
// -------------------------------------------------------

const mapping: Record<string, string> = {
    a: "अ", aa: "आ", i: "इ", ee: "ई", u: "उ", oo: "ऊ",
    e: "ए", ai: "ऐ", o: "ओ", au: "औ",

    k: "क", kh: "ख", g: "ग", gh: "घ", ch: "च", chh: "छ",
    j: "ज", jh: "झ", t: "त", th: "थ", d: "द", dh: "ध",
    n: "न", p: "प", ph: "फ", b: "ब", bh: "भ",
    m: "म", y: "य", r: "र", l: "ल", v: "व",
    sh: "श", s: "स", h: "ह",

    // Extras
    ksh: "क्ष", gny: "ज्ञ", tr: "त्र"
};

const matras: Record<string, string> = {
    a: "", aa: "ा", i: "ि", ee: "ी", u: "ु", oo: "ू",
    e: "े", ai: "ै", o: "ो", au: "ौ"
};

export function engToHindi(input: string): string {
    input = input.toLowerCase().trim();
    if (!input) return "";

    let result = "";
    let i = 0;

    while (i < input.length) {
        let two = input.slice(i, i + 2);
        let three = input.slice(i, i + 3);
        let one = input[i];

        // Try 3-letter cluster (ksh, gny, tr)
        if (mapping[three]) {
            result += mapping[three];
            i += 3;
            continue;
        }

        // Try consonant + vowel matra pattern
        if (mapping[two] && matras[input[i + 2]]) {
            result += mapping[two] + matras[input[i + 2]];
            i += 3;
            continue;
        }

        // Try 2-letter consonant
        if (mapping[two]) {
            result += mapping[two];
            i += 2;
            continue;
        }

        // Try vowel matra alone
        if (matras[one] !== undefined) {
            result += matras[one];
            i += 1;
            continue;
        }

        // Single consonant mapping
        if (mapping[one]) {
            result += mapping[one];
            i += 1;
            continue;
        }

        // Default: pass character
        result += one;
        i++;
    }

    return result;
}