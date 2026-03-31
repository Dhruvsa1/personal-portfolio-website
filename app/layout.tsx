import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "D.D.",
  description: "My personal portfolio website built with Next.js",
  icons: {
    icon: "https://website-file-manager.b-cdn.net/Website%20Assets/Screenshot%202025-11-06%20at%2012.59.43%E2%80%AFPM.png",
    shortcut: "https://website-file-manager.b-cdn.net/Website%20Assets/Screenshot%202025-11-06%20at%2012.59.43%E2%80%AFPM.png",
    apple: "https://website-file-manager.b-cdn.net/Website%20Assets/Screenshot%202025-11-06%20at%2012.59.43%E2%80%AFPM.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`antialiased font-sans bg-[#050510] text-[#e2e8f0]`}>
        {children}
      </body>
    </html>
  );
}

