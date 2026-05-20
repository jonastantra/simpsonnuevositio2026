import "./globals.css";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lossimpsonsonline.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Los Simpsons Online - Ver todas las temporadas",
    template: "%s | Los Simpsons Online",
  },
  description:
    "Ver Los Simpsons online en espanol latino. Todas las temporadas, capitulos completos, especiales de Springfield y episodios de Homer, Bart, Lisa, Marge y Maggie.",
  keywords: [
    "Los Simpsons online",
    "ver Los Simpsons",
    "Los Simpsons espanol latino",
    "capitulos de Los Simpsons",
    "temporadas de Los Simpsons",
    "Homer Simpson",
    "Bart Simpson",
    "Lisa Simpson",
    "Marge Simpson",
    "Springfield",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Los Simpsons Online",
    title: "Los Simpsons Online",
    description:
      "Todas las temporadas de Los Simpsons, capitulos completos y especiales de Springfield en una experiencia rapida para moviles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Simpsons Online",
    description: "Capitulos completos de Los Simpsons online en espanol latino.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Los Simpsons Online",
    alternateName: ["Ver Los Simpsons", "Simpsons Online", "Los Simpsons en espanol latino"],
    url: siteUrl,
    inLanguage: "es-MX",
    about: ["Los Simpsons", "Homer Simpson", "Bart Simpson", "Lisa Simpson", "Marge Simpson", "Springfield"],
    publisher: {
      "@type": "Organization",
      name: "Los Simpsons Online",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es">
      <body>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TSPLMFD');`}
        </Script>
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4380860154184351"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSPLMFD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
