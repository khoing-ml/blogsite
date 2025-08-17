import "../styles/globals.css";
import { ReactNode } from "react";
import SiteSidebar from "../components/SiteSidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "My Research Blogsite",
  description: "Undergraduate to PhD – Machine Learning Blog & Research Log"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        <SiteSidebar />
        <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
          <main>{children}</main>
          <footer className="mt-24 mb-10 text-xs text-neutral-500">© {new Date().getFullYear()} Khoi's Research Journey.</footer>
        </div>
      </body>
    </html>
  );
}
