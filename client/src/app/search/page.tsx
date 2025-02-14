"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  InputAdornment,
  Typography,
  Skeleton,
  Divider,
  Alert
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  const breadcrumbs = [{ label: "Search", href: "/search" }];

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Search" breadcrumbs={breadcrumbs} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <TextField
          fullWidth
          placeholder="Search for projects, tasks, or users..."
          variant="outlined"
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          className="bg-white dark:bg-gray-900 rounded-xl"
        />

        <div className="mt-8">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={100} className="rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <Alert severity="error" className="rounded-xl">
              Error occurred while fetching search results.
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {!isLoading && !isError && searchResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {(searchResults?.tasks && searchResults.tasks.length > 0) && (
                  <div>
                    <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white">
                      Tasks
                    </Typography>
                    <div className="grid gap-4 md:grid-cols-2">
                      {searchResults.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults?.projects && searchResults.projects.length > 0 && (
                  <div>
                    <Divider className="my-6" />
                    <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white">
                      Projects
                    </Typography>
                    <div className="grid gap-4 md:grid-cols-2">
                      {searchResults.projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults?.users && searchResults.users.length > 0 && (
                  <div>
                    <Divider className="my-6" />
                    <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white">
                      Users
                    </Typography>
                    <div className="grid gap-4 md:grid-cols-3">
                      {searchResults.users.map((user) => (
                        <UserCard key={user.userId} user={user} />
                      ))}
                    </div>
                  </div>
                )}

                {(!searchResults.tasks?.length &&
                  !searchResults.projects?.length &&
                  !searchResults.users?.length &&
                  searchTerm.length >= 3) && (
                  <Alert severity="info" className="rounded-xl">
                    No results found for "{searchTerm}"
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Search;
