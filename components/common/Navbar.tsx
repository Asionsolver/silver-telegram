"use client";
import Link from "next/link";
import { Github, Plane } from "lucide-react";
import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
export const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <nav className="bg-white shadow-md py-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 flex items-center"
        >
          <Plane stroke="#42A5F5" />
          <span className="ml-2 text-[#42A5F5]">TripSculptor</span>
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link
                href={"/trips"}
                className="text-slate-900 hover:text-sky-500"
              >
                My Trips
              </Link>
              <Link
                href={"/globe"}
                className="text-slate-900 hover:text-sky-500"
              >
                Globe
              </Link>
              <button
                className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-sm hover:bg-gray-900 transition-colors gap-2 cursor-pointer"
                onClick={logout}
              >
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-sm hover:bg-gray-900 transition-colors gap-2 cursor-pointer"
              onClick={login}
            >
              <span>Sign In</span>

              <Github />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
