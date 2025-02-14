import React from "react";
import { Bell, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { motion } from "framer-motion";
import { Avatar, Badge, IconButton, Tooltip } from "@mui/material";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-6 py-[11px] backdrop-blur-md dark:bg-gray-900/80 shadow-sm"
    >
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-6 w-6 dark:text-white" />
          </motion.button>
        )}
        <div className="relative flex h-min w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder-gray-400
              transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
              dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500"
            type="search"
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip title="Notifications">
          <IconButton className="relative">
            <Badge badgeContent={3} color="error">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="transition-transform hover:scale-110"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings">
          <IconButton component={Link} href="/settings">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </IconButton>
        </Tooltip>

        <div className="mx-4 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        <Tooltip title="Profile">
          <IconButton className="ml-2">
            <Avatar
              src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
              alt="User"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </motion.div>
  );
};

export default Navbar;
