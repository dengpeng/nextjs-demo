import "~/styles/globals.css";

import localFont from "next/font/local";
import { Toaster } from "./_components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const mainFont = localFont({
  src: "../styles/Satoshi-Variable.woff2",
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Next.js Patterns",
  description:
    "A (working-in-progress) collection of demos and examples of common patterns & best practices used in the development of Next.js & React applications.",
  icons: [
    {
      rel: "icon",
      url: "/favicon-light.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/favicon-dark.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${mainFont.variable}`}>
        {children}
        <Toaster position="top-center" />
        <SpeedInsights />
      </body>
    </html>
  );
}
