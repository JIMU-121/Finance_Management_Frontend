import React from "react";
import { Link } from "react-router";
import GridShape from "../../components/common/GridShape";
import Logo from "../../components/common/Logo";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none">
        <GridShape />
      </div>

      <div className="relative z-10 w-full max-w-[450px] animate-fade-in-up">
        {/* Logo above the form */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo variant="full" width={160} height={40} animate={true} />
          </Link>
        </div>


        {/* The Auth Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-theme-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
           {children}
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} IDL Financial Management. All rights reserved.
        </p>
      </div>

      {/* Theme Toggler - Fixed Position */}
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}


