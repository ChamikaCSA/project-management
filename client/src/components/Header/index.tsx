import React from "react";
import { motion } from "framer-motion";
import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type Props = {
  name: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
  breadcrumbs?: { label: string; href: string }[];
};

const Header = ({ name, buttonComponent, isSmallText = false, breadcrumbs }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      {breadcrumbs && (
        <Breadcrumbs
          separator={<ChevronRight className="h-4 w-4 text-gray-400" />}
          className="mb-4"
        >
          <MuiLink
            component={Link}
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            underline="hover"
          >
            <Home className="h-4 w-4" />
            Home
          </MuiLink>
          {breadcrumbs.map((crumb, index) => (
            <MuiLink
              key={index}
              component={Link}
              href={crumb.href}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              underline="hover"
            >
              {crumb.label}
            </MuiLink>
          ))}
        </Breadcrumbs>
      )}

      <div className="flex items-center justify-between pt-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${
            isSmallText ? "text-xl" : "text-3xl"
          } font-bold tracking-tight text-gray-900 dark:text-white`}
        >
          {name}
        </motion.h1>
        {buttonComponent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {buttonComponent}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Header;
