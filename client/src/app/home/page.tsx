"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Box, Skeleton, IconButton, Tooltip as MuiTooltip, CircularProgress, LinearProgress } from "@mui/material";
import { RefreshRounded, FullscreenRounded, DownloadRounded, TrendingUpRounded, MoreVertRounded } from "@mui/icons-material";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const taskColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center h-full gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="font-medium truncate">{params.value}</span>
      </div>
    )
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          params.value === 'Completed'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
            : params.value === 'In Progress'
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200'
            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
        }`}>
          {params.value}
        </div>
      </div>
    )
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        <div className={`px-3 py-1 rounded-full text-sm ${
          params.value === 'High'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : params.value === 'Medium'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {params.value}
        </div>
      </div>
    )
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center h-full text-sm">
        {params.value ? format(new Date(params.value), 'MMM dd, yyyy') : '-'}
      </div>
    )
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  onRefresh: () => void;
  isLoading: boolean;
  metric?: string;
  trend?: number;
  className?: string;
}

const ChartCard = ({ title, children, onRefresh, isLoading, metric, trend, className }: ChartCardProps) => {
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
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric}</span>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <TrendingUpRounded className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
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

const HomePage = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const breadcrumbs = [{ label: "Dashboard", href: "/" }];

  if (tasksLoading || isProjectsLoading) {
    return (
      <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <Header name="Project Management Dashboard" breadcrumbs={breadcrumbs} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <Skeleton variant="text" width="200px" height={32} className="mb-4" />
              <Skeleton variant="rectangular" height={300} />
            </div>
          ))}
          <div className="md:col-span-2 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <Skeleton variant="text" width="200px" height={32} className="mb-4" />
            <Skeleton variant="rectangular" height={400} />
          </div>
        </div>
      </div>
    );
  }

  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
        background: "rgba(255, 255, 255, 0.05)",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
        background: "rgba(0, 0, 0, 0.02)",
      };

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Project Management Dashboard" breadcrumbs={breadcrumbs} />

      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <ChartCard
            title="Task Priority Distribution"
            onRefresh={handleRefresh}
            isLoading={tasksLoading}
            metric={`${tasks?.length || 0} Tasks`}
            trend={12}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
                <XAxis
                  dataKey="name"
                  stroke={chartColors.text}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                />
                <YAxis
                  stroke={chartColors.text}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: chartColors.text,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                />
                <Bar
                  dataKey="count"
                  fill={chartColors.bar}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Project Status"
            onRefresh={handleRefresh}
            isLoading={isProjectsLoading}
            metric={`${projects?.length || 0} Projects`}
            trend={-5}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={projectStatus}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  paddingAngle={2}
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {projectStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: chartColors.text,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <motion.div className="md:col-span-2">
            <ChartCard
              title="Your Tasks"
              onRefresh={handleRefresh}
              isLoading={tasksLoading}
            >
              <Box sx={{
                height: 400,
                width: "100%",
                '& .MuiDataGrid-root': {
                  border: 'none',
                  backgroundColor: 'transparent',
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.25)' : 'rgba(79, 70, 229, 0.12)',
                    },
                  },
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                  color: isDarkMode ? '#fff' : 'inherit',
                  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.1)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'transparent',
                  borderBottom: isDarkMode ? '2px solid rgba(255, 255, 255, 0.05)' : '2px solid rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#fff' : 'inherit',
                },
              }}>
                <DataGrid
                  rows={tasks}
                  columns={taskColumns}
                  checkboxSelection
                  loading={tasksLoading}
                  getRowClassName={() => "data-grid-row"}
                  getCellClassName={() => "data-grid-cell"}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                    sorting: {
                      sortModel: [{ field: 'dueDate', sort: 'asc' }],
                    },
                  }}
                />
              </Box>
            </ChartCard>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
