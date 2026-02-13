import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claws",
  description: "You are the AI now. Handle requests, use tools, survive security traps.",
  icons: {
    icon: "/claws.svg",
  },
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
