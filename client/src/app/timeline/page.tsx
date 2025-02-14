"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconButton,
  Tooltip as MuiTooltip,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Button
} from "@mui/material";
import {
  RefreshRounded,
  FullscreenRounded,
  DownloadRounded,
  FilterListRounded,
  ViewWeekRounded,
  ViewDayRounded,
  CalendarMonthRounded,
  MoreVertRounded
} from "@mui/icons-material";

type TaskTypeItems = "task" | "milestone" | "project";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  onRefresh: () => void;
  isLoading: boolean;
  metric?: string;
  className?: string;
}

const ChartCard = ({ title, children, onRefresh, isLoading, metric, className }: ChartCardProps) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800
        ${isFullscreen ? 'fixed inset-0 z-50' : 'hover:shadow-lg'} ${className || ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          {metric && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{metric}</span>
          )}
        </div>
        <div className="flex gap-2">
          <MuiTooltip title="More">
            <IconButton size="small" className="text-gray-500 hover:text-gray-700">
              <MoreVertRounded />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Refresh">
            <IconButton size="small" onClick={onRefresh} className="text-gray-500 hover:text-gray-700">
              {isLoading ? <CircularProgress size={20} /> : <RefreshRounded />}
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Fullscreen">
            <IconButton size="small" onClick={toggleFullscreen} className="text-gray-500 hover:text-gray-700">
              <FullscreenRounded />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Download">
            <IconButton size="small" className="text-gray-500 hover:text-gray-700">
              <DownloadRounded />
            </IconButton>
          </MuiTooltip>
        </div>
      </div>
      {isLoading ? (
        <div className="w-full">
          <LinearProgress
            className="rounded-full"
            sx={{
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isDarkMode ? '#4F46E5' : '#4F46E5'
              }
            }}
          />
        </div>
      ) : children}
    </motion.div>
  );
};

const Timeline = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      })) || []
    );
  }, [projects]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const breadcrumbs = [{ label: "Timeline", href: "/timeline" }];

  if (isLoading) {
    return (
      <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <Header name="Projects Timeline" breadcrumbs={breadcrumbs} />
        <div className="mt-4">
          <Skeleton variant="rectangular" height={600} className="rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !projects) return <div>Error fetching projects</div>;

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Projects Timeline" breadcrumbs={breadcrumbs} />

      <div className="flex gap-4 mb-6 mt-4">
        <Button
          variant={displayOptions.viewMode === ViewMode.Day ? "contained" : "outlined"}
          startIcon={<ViewDayRounded />}
          onClick={() => setDisplayOptions(prev => ({ ...prev, viewMode: ViewMode.Day }))}
        >
          Day
        </Button>
        <Button
          variant={displayOptions.viewMode === ViewMode.Week ? "contained" : "outlined"}
          startIcon={<ViewWeekRounded />}
          onClick={() => setDisplayOptions(prev => ({ ...prev, viewMode: ViewMode.Week }))}
        >
          Week
        </Button>
        <Button
          variant={displayOptions.viewMode === ViewMode.Month ? "contained" : "outlined"}
          startIcon={<CalendarMonthRounded />}
          onClick={() => setDisplayOptions(prev => ({ ...prev, viewMode: ViewMode.Month }))}
        >
          Month
        </Button>
        <div className="flex-grow" />
        <Button
          variant="outlined"
          startIcon={<FilterListRounded />}
        >
          Filter
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <ChartCard
          title="Project Timeline"
          onRefresh={handleRefresh}
          isLoading={isLoading}
          metric={`${projects.length} Projects`}
        >
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="dark:text-white">
              <Gantt
                tasks={ganttTasks}
                {...displayOptions}
                columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                listCellWidth="200px"
                rowHeight={50}
                barCornerRadius={4}
                projectBackgroundColor={isDarkMode ? "#374151" : "#E5E7EB"}
                projectProgressColor={isDarkMode ? "#4F46E5" : "#4F46E5"}
                projectProgressSelectedColor={isDarkMode ? "#6366F1" : "#6366F1"}
                barProgressColor={isDarkMode ? "#4F46E5" : "#4F46E5"}
                barProgressSelectedColor={isDarkMode ? "#6366F1" : "#6366F1"}
                handleWidth={8}
                timeStep={1000 * 60 * 60 * 24}
                fontSize="12px"
                todayColor={isDarkMode ? "rgba(79, 70, 229, 0.1)" : "rgba(79, 70, 229, 0.1)"}
              />
            </div>
          </div>
        </ChartCard>
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
