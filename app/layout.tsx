import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://aurumagent.xyz"),
  title: {
    default: "AURUM",
    template: "%s | AURUM",
  },
  description:
    "AURUM is a public AI macro agent. Charts. News. Odds. Conviction. Token-powered intelligence for macro markets.",
  keywords: ["AURUM", "macro agent", "AI trading", "Polymarket", "prediction markets", "macro intelligence"],
  openGraph: {
    title: "AURUM",
    description: "A public AI agent that studies markets before it acts.",
    url: "https://aurumagent.xyz",
    siteName: "AURUM",
    type: "website",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUM",
    description: "Charts. News. Odds. Conviction.",
    creator: "@AurumAgent",
  },
  icons: {
    icon: "/logos/favicon.ico",
    shortcut: "/logos/favicon.ico",
    apple: "/logos/aurum_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-aurum-bg text-aurum-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
