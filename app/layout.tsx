import type { Metadata } from "next";

import { SiteAudioEager } from "@/components/SiteAudio/Eager";
import { SITE_SONG_ELEMENT_ID, SITE_SONG_URL } from "@/lib/site-song";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabriel & Stefani",
  description: "Em breve.",
  robots: { index: false, follow: false },
};

const audioBoot = `(function(){try{var a=document.getElementById("${SITE_SONG_ELEMENT_ID}");if(!a)return;a.volume=0.16;var play=function(){var p=a.play();if(p&&p.catch)p.catch(function(){})};play();a.addEventListener("canplay",play);var events=["pointerdown","touchstart","click","keydown"];var unlock=function(e){if(e.target&&e.target.closest&&e.target.closest("[data-sound-toggle]"))return;play();if(!a.paused){events.forEach(function(n){window.removeEventListener(n,unlock,true)})}};events.forEach(function(n){window.addEventListener(n,unlock,true)})}catch(e){}})();`;

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
        <link rel="preload" href={SITE_SONG_URL} as="audio" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=='/'&&p!=='')return;history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',p+location.search);window.scrollTo(0,0);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <audio
          id={SITE_SONG_ELEMENT_ID}
          src={SITE_SONG_URL}
          autoPlay
          loop
          playsInline
          preload="auto"
          className="pointer-events-none fixed h-px w-px overflow-hidden opacity-0"
        />
        <script dangerouslySetInnerHTML={{ __html: audioBoot }} />
        <SiteAudioEager />
      </body>
    </html>
  );
}
