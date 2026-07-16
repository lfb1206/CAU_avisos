import React from 'react';
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavigationBar from "@/resources/form/components/NavigationBar";

export const metadata = {
  title: "Portal CAU",
  description: "Plataforma web Club Andino Universitario",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="font-sans bg-white">
        <NavigationBar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
