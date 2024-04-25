import "~/styles/globals.css";

import localFont from "next/font/local";
import { Toaster } from "./_components/ui/sonner";

const mainFont = localFont({
  src: "../styles/SNPro-Variable.woff2",
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Next.js Demo",
  description: "A series demo for common patterns",
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
      </body>
    </html>
  );
}
