// "use client";

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
// import { useSession } from "next-auth/react";

export default function Nav() {
  // const { data: session } = useSession();

  return (
    <nav className={nav}>
      <Link href="/">
        <FaHome /> <span>Home</span>
      </Link>
      {/* {session && ( */}
      <>
        <Link href="/today">
          <FaAngleDown /> <span>Today</span>
        </Link>
        <Link href="/tomorrow">
          <FaAngleRight /> <span>Tomorrow</span>
        </Link>
        <Link href="/someday">
          <FaAngleDoubleRight /> <span>Someday</span>
        </Link>
        <Link href="/add">
          <FaPlus /> <span>Add Task</span>
        </Link>
        <Link href="/settings">
          <FaUserCircle /> <span>Settings</span>
        </Link>
      </>
      {/* )} */}
    </nav>
  );
}
