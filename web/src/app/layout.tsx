import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "typist",
  description: "try your typing luck today",
};

import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { TopNav } from "@/components/top-nav";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`flex flex-col m-auto px-5 justify-between gap-5 min-h-dvh bg-neutral-900 text-neutral-300 ${inter.className}`}
        suppressHydrationWarning={true}
      >
        <AuthKitProvider>
          <div className="flex flex-grow flex-col">
            <TopNav />
            {children}
          </div>
          <Footer />
        </AuthKitProvider>
      </body>
    </html>
  );
};

export default MainLayout;
