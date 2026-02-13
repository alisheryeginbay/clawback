import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clawback",
  description: "You are the AI now. Handle requests, use tools, survive security traps.",
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
