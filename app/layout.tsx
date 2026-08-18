import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteAudioLoader } from "@/components/SiteAudio/Loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabriel & Stefani",
  description: "Em breve.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href="/uploads/pra-sempre-com-voce.mp3" as="audio" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=='/'&&p!=='')return;history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',p+location.search);window.scrollTo(0,0);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Suspense fallback={null}>
          <SiteAudioLoader />
        </Suspense>
      </body>
    </html>
  );
}
