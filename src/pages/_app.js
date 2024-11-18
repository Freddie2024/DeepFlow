import localFont from "next/font/local";
import "../styles/globals.css";
import Main_Layout from "../components/layouts/Main_Layout";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <Main_Layout>
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick={true}
              pauseOnHover={true}
            />
          </SWRConfig>
        </Main_Layout>
      </div>
    </SessionProvider>
  );
}
