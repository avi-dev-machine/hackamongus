import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hack Among Us | Leaderboard",
  description: "Live leaderboard for the Hack Among Us hackathon at Heritage Institute of Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
