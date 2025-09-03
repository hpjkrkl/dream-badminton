import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProvidersClerk } from "@/components/providers-clerk";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dream Badminton - Fantasy Sports",
  description: "Build your ultimate badminton squad and compete with friends in the most exciting fantasy sports experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ProvidersClerk>
            {children}
          </ProvidersClerk>
        </ThemeProvider>
      </body>
    </html>
  );
}
