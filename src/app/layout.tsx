import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f11] text-[#e5e5e5] flex">

        <ClientSessionProvider>
          <Sidebar />
          <main className="flex-1 p-16">
            <div className="max-w-3xl mx-auto">{children}</div>
          </main>
        </ClientSessionProvider>

      </body>
    </html>
  );
}
