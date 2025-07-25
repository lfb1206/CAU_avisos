import "./globals.css";

export const metadata = {
  title: "CAU - Socios",
  description: "Plataforma web Club Andino Universitario",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
