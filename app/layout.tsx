import "../styles/globals.css";
import { ReactNode } from "react";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "ML Journey",
  description: "Undergrad to PhD – Machine Learning Blog & Research Log"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="max-w-3xl mx-auto px-4 py-8">
        <SiteHeader />
        <main className="mt-8">{children}</main>
        <footer className="mt-16 mb-8 text-sm text-neutral-500">© {new Date().getFullYear()} ML Journey.</footer>
      </body>
    </html>
  );
}
