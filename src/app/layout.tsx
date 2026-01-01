import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import Floating from "~/components/floating";

export const metadata: Metadata = {
  title: "itinerarium",
  description: "Clock based productivity app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="from-background relative flex h-screen grow bg-linear-90 to-zinc-800">
              {children}
              <Floating />
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
