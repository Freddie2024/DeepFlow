import Head from "next/head";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";

export default function Main_Layout({ children }) {
  return (
    <div className="aurora-container">
      <div className="aurora-content">
        <Head>
          <title>DeepFlow</title>
          <meta
            name="description"
            content="Keep track of your most important tasks for today"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
