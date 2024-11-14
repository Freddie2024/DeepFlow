import localFont from "next/font/local";
import "../styles/globals.css";
import Main_Layout from "../components/layouts/Main_Layout";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function App({ Component, ...pageProps }) {
  return (
    <SessionProvider>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <Main_Layout>
          <Component {...pageProps} />
        </Main_Layout>
      </div>
    </SessionProvider>
  );
}
