import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "Clone of notion app. Not affiliated with notion company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={``}>
          <Header />
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
