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
        <FaHome /> Home
      </Link>
      {/* {session && ( */}
      <>
        <Link href="/today">
          <FaAngleDown /> Today
        </Link>
        <Link href="/tomorrow">
          <FaAngleRight /> Tomorrow
        </Link>
        <Link href="/someday">
          <FaAngleDoubleRight /> Someday
        </Link>
        <Link href="/add">
          <FaPlus /> Add Task
        </Link>
        <Link href="/settings">
          <FaUserCircle /> Settings
        </Link>
      </>
      {/* )} */}
    </nav>
  );
}
