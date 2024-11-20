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
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link href="/about">
        <Info /> <span>About</span>
      </Link>

      <Link href="/contact">
        <UserPlus /> <span>Contact</span>
      </Link>

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
          <div className={styles.desktopNav}>
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
            {/* <Link href="/settings">
            <Settings /> <span>Settings</span>
          </Link> */}
          </div>

          <div className={styles.mobileNav}>
            <Link href="/tasks/list/today">
              <CalendarCheck /> <span>Today</span>
            </Link>

            <button
              className={styles.moreButton}
              onClick={() => setShowMore(!showMore)}
            >
              <MoreHorizontal /> <span>More</span>
            </button>

            {showMore && (
              <div className={styles.moreMenu}>
                <Link href="/tasks/list/tomorrow">
                  <CalendarClock /> <span>Tomorrow</span>
                </Link>
                <Link href="/tasks/list/later">
                  <CalendarDays /> <span>Later Date</span>
                </Link>
                <Link href="/tasks/list/someday">
                  <CalendarRange /> <span>Someday</span>
                </Link>
              </div>
            )}
            <Link href="/create">
              <PlusCircle /> <span>Add Task</span>
            </Link>
          </div>
        </>
      ) : null}

      {session ? (
        <button
          onClick={() => signOut()}
          title="Sign Out"
          className={styles.iconButton}
        >
          <LogOut /> <span>Logout</span>
        </button>
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
