// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Head from 'next/head'; // Import the Head component
import "./globals.css";
import { ThemeProvider } from './components/ThemeProvider'; // Import ThemeProvider


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <Head>
        {/* Google tag (gtag.js) - This is CORRECT placement within <Head> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2D18CMVZEF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2D18CMVZEF');
            `,
          }}
        />
      </Head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider> {/* Wrap the children with ThemeProvider */}
          {children}
        </ThemeProvider>
        <div dangerouslySetInnerHTML={{ __html: zapierCode }} />
      </body>
    </html>
  );
}