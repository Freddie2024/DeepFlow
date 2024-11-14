"use client";

import Link from "next/link";
import { nav } from "./Nav.module.css";
import {
  FaHome,
  FaUserCircle,
  FaPlus,
  FaAngleDown,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className={nav}>
      <Link href="/">
        <FaHome /> <span>Home</span>
      </Link>
      {session ? (
        <>
          <Link href="/tasks/list/today">
            <FaAngleDown /> <span>Today</span>
          </Link>
          <Link href="/tasks/list/tomorrow">
            <FaAngleRight /> <span>Tomorrow</span>
          </Link>
          <Link href="/tasks/list/later">
            {/* hier noch ein passendes kalender-icon einfügen */}
            <FaAngleDoubleRight /> <span>Later Date</span>
          </Link>
          <Link href="/tasks/list/someday">
            <FaAngleDoubleRight /> <span>Someday</span>
          </Link>
          <Link href="/create">
            <FaPlus /> <span>Add Task</span>
          </Link>
          <Link href="/settings">
            <FaUserCircle /> <span>Settings</span>
          </Link>
          <button onClick={() => signOut()} style={{ marginLeft: "auto" }}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => signIn("google")}>Login</button>
      )}
    </nav>
  );
}
