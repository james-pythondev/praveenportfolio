export const metadata = {
  title: "Praveen Photography | Fine Art Wedding, Maternity & Portrait Photographer",
  description:
    "Praveen is a fine art photographer specializing in timeless weddings, emotive maternity portraits, baby shoots, and cinematic portraiture. Book your session today.",
  keywords: [
    "photographer",
    "wedding photographer",
    "maternity photography",
    "portrait photographer",
    "baby shoot photographer",
    "fine art photography",
    "engagement photography",
    "candid wedding photography",
    "Praveen photographer",
  ],
  authors: [{ name: "Praveen" }],
  creator: "Praveen Photography",
  metadataBase: new URL("https://praveenphotography.vercel.app"),
  openGraph: {
    title: "Praveen Photography | Fine Art Wedding & Portrait Photographer",
    description:
      "Capturing timeless grace through elegant, cinematic imagery. Weddings, maternity, baby shoots, and portraits.",
    url: "https://praveenphotography.vercel.app",
    siteName: "Praveen Photography",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/abc.jpeg",
        width: 1200,
        height: 630,
        alt: "Praveen Photography Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praveen Photography | Fine Art Photographer",
    description:
      "Timeless weddings, emotive maternity portraits, and cinematic portraiture by Praveen.",
    images: ["/abc.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export const viewport = {
  themeColor: "#1a1a18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
