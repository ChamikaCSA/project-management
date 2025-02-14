"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar, Button, IconButton, Tooltip, Chip, AvatarGroup,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, LinearProgress
} from "@mui/material";
import {
  RefreshRounded, DownloadRounded, FilterListRounded,
  AddRounded, MoreVertRounded, EditRounded, DeleteRounded,
  GroupsRounded, PersonRounded
} from "@mui/icons-material";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const CustomToolbar = () => (
  <div className="flex justify-between items-center p-2">
    <div className="flex gap-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </div>
    <Button
      variant="contained"
      startIcon={<AddRounded />}
      className="bg-indigo-600 hover:bg-indigo-700"
    >
      Create Team
    </Button>
  </div>
);

const ChartCard = ({ title, children, onRefresh, isLoading, metric, className }: {
  title: string;
  children: React.ReactNode;
  onRefresh: () => void;
  isLoading: boolean;
  metric?: string;
  className?: string;
}) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100
        dark:border-gray-800 hover:shadow-lg transition-shadow ${className || ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          {metric && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{metric}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={onRefresh} className="text-gray-500 hover:text-gray-700">
              {isLoading ? <LinearProgress className="w-6" /> : <RefreshRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" className="text-gray-500 hover:text-gray-700">
              <DownloadRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton size="small" className="text-gray-500 hover:text-gray-700">
              <MoreVertRounded />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {children}
    </motion.div>
  );
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: "teamName",
    headerName: "Team",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full">
        <Avatar className="bg-indigo-600">
          <GroupsRounded />
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium dark:text-white leading-tight">{params.value}</div>
          <div className="text-xs text-gray-500 leading-tight">5 Members</div>
        </div>
      </div>
    ),
  },
  {
    field: "productOwnerUsername",
    headerName: "Product Owner",
    width: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-2 h-full">
        <Avatar className="h-6 w-6">
          <PersonRounded className="h-4 w-4" />
        </Avatar>
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-2 h-full">
        <Avatar className="h-6 w-6">
          <PersonRounded className="h-4 w-4" />
        </Avatar>
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "members",
    headerName: "Team Members",
    width: 200,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        <AvatarGroup max={4}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Avatar key={i} className="h-8 w-8">
              <PersonRounded />
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <div className="flex items-center gap-2 h-full">
        <Tooltip title="Edit Team">
          <IconButton size="small">
            <EditRounded className="h-4 w-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Team">
          <IconButton size="small" color="error">
            <DeleteRounded className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError, refetch } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const breadcrumbs = [{ label: "Teams", href: "/teams" }];

  if (isError) {
    return (
      <div className="p-8">
        <Alert severity="error">Error fetching teams data</Alert>
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Teams" breadcrumbs={breadcrumbs} />

      <div className="flex gap-4 mb-6">
        <Button
          variant="outlined"
          startIcon={<FilterListRounded />}
        >
          Filter
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <ChartCard
          title="Teams Management"
          onRefresh={handleRefresh}
          isLoading={isLoading}
          metric={`${teams?.length || 0} Active Teams`}
        >
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={teams || []}
              columns={columns}
              pagination
              slots={{
                toolbar: CustomToolbar,
              }}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
              loading={isLoading}
            />
          </div>
        </ChartCard>
      </AnimatePresence>
    </div>
  );
};

export default Teams;
