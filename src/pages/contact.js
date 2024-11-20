import styles from "./contact.module.css";
import Image from "next/image";

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1>Let&apos;s Connect!</h1>
      <p>
        If you want to get an update when DeepFlow is updated, <br />
        drop me a line:
        <br />
        <br />
        <a
          href="mailto:fridaysdevelopment@gmail.com"
          className={styles.emailLink}
        >
          fridaysdevelopment@gmail.com
        </a>
      </p>

      <div className={styles.qrSections}>
        <div className={styles.qrSection}>
          <h2>
            <a
              href="https://www.linkedin.com/in/frida-lemke"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Connect on LinkedIn
              <Image
                src="/linkedin.svg"
                alt="LinkedIn Icon"
                width={24}
                height={24}
                className={styles.icon}
              />
            </a>
          </h2>
          <Image
            src="/linkedin-qr.png"
            alt="LinkedIn QR Code"
            width={100}
            height={100}
            className={styles.qrCode}
            priority
          />
        </div>

        <div className={styles.qrSection}>
          <h2>
            <a
              href="https://github.com/Freddie2024"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Check out my GitHub
              <Image
                src="/github.svg"
                alt="GitHub Icon"
                width={24}
                height={24}
                className={styles.icon}
              />
            </a>
          </h2>
          <Image
            src="/github-qr.png"
            alt="GitHub QR Code"
            width={100}
            height={100}
            className={styles.qrCode}
            priority
          />
        </div>

        <div className={styles.qrSection}>
          <h2>Try DeepFlow my Capstone Project</h2>
          <Image
            src="/deepflow-qr.png"
            alt="QR Code to DeepFlow"
            width={100}
            height={100}
            className={styles.qrCode}
            priority
          />
        </div>
      </div>
    </div>
  );
}
