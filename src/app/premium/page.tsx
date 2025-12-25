import Link from "next/link";

export default function PremiumPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fadeIn">
            <div className="text-6xl mb-4">💎</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                Premium Content
            </h1>
            <p className="text-xl text-gray-400 max-w-md">
                This content is available exclusively for our premium members.
                Please upgrade, upgrade feature coming soon.
            </p>

            <div className="flex gap-4 mt-8">
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
                >
                    Go Home
                </Link>
                {/*<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold hover:scale-105 transition shadow-lg shadow-amber-500/20">
                    Upgrade Now
                </button>*/}
            </div>
        </div>
    );
}
