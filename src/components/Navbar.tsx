"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900/80 backdrop-blur-xl border-b border-gray-700 fixed w-full z-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          href="#"
          className="text-xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          SecretMsg
        </a>
        {session ? (
          <>
            <span className="mr-4 text-gray-200">
              Welcome, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
