import Head from "next/head";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";
import styles from "./Main_Layout.module.css";

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
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
