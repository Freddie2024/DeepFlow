import localFont from "next/font/local";
import "../styles/globals.css";
import Main_Layout from "../components/layouts/Main_Layout";
// import SessionProvider from "@/components/SessionProvider";

// import { getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]/route";

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

export const metadata = {
  title: "DeepFlow",
  description: "Keep track of your most important tasks for today",
};

export default function RootLayout({ children }) {
  // const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      {/* <SessionProvider session={session}> */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Main_Layout>{children}</Main_Layout>
      </body>
      {/* </SessionProvider> */}
    </html>
  );
}
