"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Tooltip } from "@mui/material";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 bg-white dark:bg-gray-900 overflow-hidden
    ${isSidebarCollapsed ? "w-0" : "w-64"}
  `;

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={sidebarClassNames}
    >
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* Logo Section */}
        <motion.div
          className="z-50 flex min-h-20 w-64 items-center justify-between bg-white/80 px-6 backdrop-blur-md dark:bg-gray-900/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              PROJECT MANAGEMENT
            </div>
          </Link>
          {!isSidebarCollapsed && (
            <Tooltip title="Collapse sidebar" placement="right">
              <button
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </Tooltip>
          )}
        </motion.div>

        {/* Team Section */}
        <div className="flex items-center gap-4 border-y border-gray-100 px-6 py-4 dark:border-gray-800">
          <Avatar
            src="https://pm-s3-images-csa.s3.us-east-1.amazonaws.com/logo.png"
            alt="Team"
            sx={{ width: 36, height: 36 }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              EDROH TEAM
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <LockIcon className="h-3 w-3" />
              Private Workspace
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS LINKS */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* PROJECTS LIST */}
        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 4 }}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
          ${isActive
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
          }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`} />
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 h-full w-1 rounded-r-full bg-indigo-500"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default Sidebar;
