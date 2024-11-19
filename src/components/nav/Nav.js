"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import {
  Home,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  PlusCircle,
  Settings,
  LogOut,
  LogIn,
  Info,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        onClick={() => {
          localStorage.setItem("clickedHome", "true");
          console.log("Home clicked, flag set");
        }}
      >
        <Home /> <span>Home</span>
      </Link>
      {session ? (
        <>
          <Link href="/tasks/list/today">
            <CalendarCheck /> <span>Today</span>
          </Link>
          <Link href="/tasks/list/tomorrow">
            <CalendarClock /> <span>Tomorrow</span>
          </Link>
          <Link href="/tasks/list/later">
            <CalendarDays /> <span>Later Date</span>
          </Link>
          <Link href="/tasks/list/someday">
            <CalendarRange /> <span>Someday</span>
          </Link>
          <Link href="/create">
            <PlusCircle /> <span>Add Task</span>
          </Link>
          <Link href="/settings">
            <Settings /> <span>Settings</span>
          </Link>
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className={styles.iconButton}
          >
            <LogOut /> <span>Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          title="Sign In"
          className={styles.iconButton}
        >
          <LogIn /> <span>Login</span>
        </button>
      )}
    </nav>
  );
}
