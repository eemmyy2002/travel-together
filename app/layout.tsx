import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel together",
  description: "Manage your trips",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="wordmark">
            Travel together
          </Link>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/archived">Archived</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
