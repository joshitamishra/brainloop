// src/lib/db.ts

// ---------- Open DB ----------
export function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("brainloopDB", 2); // ⬅ IMPORTANT: bump version

        request.onupgradeneeded = () => {
            const db = request.result;

            // Old store (already exists)
            if (!db.objectStoreNames.contains("dailyHistory")) {
                db.createObjectStore("dailyHistory");
            }

            // New store for AI question sets
            if (!db.objectStoreNames.contains("aiQuestions")) {
                db.createObjectStore("aiQuestions");
            }
        };

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// ---------- DAILY QUIZ HISTORY (your existing functionality) ----------
export async function saveTodayHistory(topic: string, history: any[]) {
    const db = await openDB();

    const tx = db.transaction("dailyHistory", "readwrite");
    const store = tx.objectStore("dailyHistory");

    const today = new Date().toISOString().split("T")[0];
    const key = `${topic}_${today}`;

    store.put(history, key);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

export async function loadTodayHistory(topic: string) {
    const db = await openDB();
    const tx = db.transaction("dailyHistory", "readonly");
    const store = tx.objectStore("dailyHistory");

    const today = new Date().toISOString().split("T")[0];
    const key = `${topic}_${today}`;

    return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
    });
}

export async function clearOldHistory() {
    const db = await openDB();
    const today = new Date().toISOString().split("T")[0];

    const tx = db.transaction("dailyHistory", "readwrite");
    const store = tx.objectStore("dailyHistory");

    return new Promise((resolve) => {
        const request = store.getAllKeys();
        request.onsuccess = () => {
            request.result.forEach((key) => {
                if (typeof key === "string" && !key.endsWith(today)) {
                    store.delete(key);
                }
            });
            resolve(true);
        };
    });
}

// ---------- NEW: AI QUESTION CACHE ----------
function getTodayKey(topic: string) {
    const today = new Date().toISOString().split("T")[0];
    return `${topic}_${today}`;
}

// Save LLM-generated questions
export async function saveAIQuestions(topic: string, questions: any[]) {
    const db = await openDB();

    const tx = db.transaction("aiQuestions", "readwrite");
    const store = tx.objectStore("aiQuestions");

    const today = new Date().toISOString().split("T")[0];
    const key = `${topic}_${today}`;

    store.put(questions, key);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

// Load cached AI questions (if already generated today)
export async function loadAIQuestions(topic: string) {
    const db = await openDB();

    const tx = db.transaction("aiQuestions", "readonly");
    const store = tx.objectStore("aiQuestions");

    const key = getTodayKey(topic);

    return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
    });
}

// Optional: Clear old questions from previous days
export async function clearOldAIQuestions() {
    const db = await openDB();
    const today = new Date().toISOString().split("T")[0];

    const tx = db.transaction("aiQuestions", "readwrite");
    const store = tx.objectStore("aiQuestions");

    return new Promise((resolve) => {
        const request = store.getAllKeys();
        request.onsuccess = () => {
            request.result.forEach((key) => {
                if (typeof key === "string" && !key.endsWith(today)) {
                    store.delete(key);
                }
            });
            resolve(true);
        };
    });
}
