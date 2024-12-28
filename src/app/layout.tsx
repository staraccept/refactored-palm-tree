import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StarAccept Payment Solutions",
  description: "Payment solutions for your business",
};

const zapierCode = `
  <script async type="module" src="https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js"></script>
  <zapier-interfaces-chatbot-embed 
    is-popup="true" 
    chatbot-id="clrxzf6j4001l14nch69l1izo"
    data-open="false"
  ></zapier-interfaces-chatbot-embed>
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <div dangerouslySetInnerHTML={{ __html: zapierCode }} />
      </body>
    </html>
  );
}