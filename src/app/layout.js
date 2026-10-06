import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import { SALON } from "@/lib/config";

export const metadata = {
  title: {
    default: `${SALON.name} · ${SALON.tagline}`,
    template: `%s · ${SALON.name}`,
  },
  description:
    "Lumière Salon & Spa — haircuts, colour, facials, nails and bridal. Book your appointment online.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF7F2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Motion />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
