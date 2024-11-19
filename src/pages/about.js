import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import styles from "./about.module.css";
import Button from "@/src/components/button/Button";

export default function About() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenAbout", "true");
    router.push("/tasks/list/today");
  };

  return (
    <div className={styles.aboutPage}>
      <h1>Welcome to DeepFlow</h1>

      <section className={styles.howItWorks}>
        <h2>How It Works - In Short</h2>
        <p className={styles.intro}>
          DeepFlow helps you focus on what matters most. Rooted in the{" "}
          <strong>1-2-3 List</strong>, DeepFlow helps you focus on 6 meaningful
          tasks:
        </p>
        <div className={styles.listContainer}>
          <ul>
            <li>
              1 long, 2 medium, 3 short tasks a day
              <br />
              (3 hours, 1 hour, 20 minutes)
            </li>
            <li>Total of 6 hours of focused work</li>
            <li>Plan ahead with Tomorrow and Later sections</li>
            <li>Keep track of future ideas in Someday</li>
          </ul>
        </div>
      </section>

      {session && !localStorage.getItem("hasSeenAbout") && (
        <Button onClick={handleGetStarted} variant="primary">
          Get Started
        </Button>
      )}

      <section className={styles.longVersion}>
        <h2>The Long Version</h2>
        <ul>
          <li>
            <h3>Why DeepFlow?</h3>
            <strong>DeepFlow</strong>is a practice designed to bring clarity and
            balance to your day. The name <strong>DeepFlow</strong> reflects a
            state of mindful focus and ease, inspired by{" "}
            <strong>Deep Flow yoga</strong>, which combines intentional movement
            with fluid transitions.
          </li>

          <li>
            <h3>Why only six tasks?</h3>
            DeepFlow encourages you to plan for no more than a total of{" "}
            <strong>6 focused hours each day</strong>, allowing space for
            breaks, transitions and the unexpected.
          </li>

          <li>
            <h3>The importance of pauses</h3>
            Pauses are an integral part of the flow, offering moments to
            recharge and prepare for what is next. Try the{" "}
            <strong>Pomodoro Technique</strong>: 25 minutes of focused work and
            a break of 5 minutes or 50 minutes of work and a break of 10
            minutes. Use a timer!
          </li>

          <li>
            <h3>Your journey with DeepFlow</h3>
            With DeepFlow, you are not just completing tasks — you are
            cultivating a daily rhythm of intention, action and renewal.
          </li>
        </ul>
      </section>

      {session ? (
        !localStorage.getItem("hasSeenAbout") ? (
          <Button onClick={handleGetStarted} variant="primary">
            Get Started
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/tasks/list/today")}
            variant="primary"
          >
            Back
          </Button>
        )
      ) : (
        <div className={styles.loginButtons}>
          <Button onClick={() => signIn("google")} variant="primary">
            Start with Google
          </Button>
          {/* <p>or</p>
          <Button onClick={() => signIn()} variant="primary">
            Start with Email
          </Button> */}
        </div>
      )}
    </div>
  );
}
