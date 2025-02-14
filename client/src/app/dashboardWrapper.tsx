"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { motion, AnimatePresence } from "framer-motion";
import { LinearProgress } from "@mui/material";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Simulate initial load
    setTimeout(() => setIsLoading(false), 1000);
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-48 mb-4">
          <LinearProgress
            sx={{
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isDarkMode ? '#4F46E5' : '#4F46E5'
              }
            }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Sidebar />
        </motion.div>
      </AnimatePresence>

      <main
        className={`flex w-full flex-col transition-all duration-200 ease-in-out
          ${isSidebarCollapsed ? "" : "md:pl-64"}`}
      >
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
