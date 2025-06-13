import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { TopNav } from "@/components/top-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`flex flex-col m-auto px-5 justify-between gap-5 min-h-dvh bg-neutral-900 text-neutral-300 ${inter.className}`}
        suppressHydrationWarning={true}
      >
        <div className="flex flex-grow flex-col">
          <TopNav />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
};
