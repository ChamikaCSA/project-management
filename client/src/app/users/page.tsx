"use client";
import { useGetUsersQuery } from "@/state/api";
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
  Avatar, Button, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, LinearProgress, Skeleton
} from "@mui/material";
import {
  RefreshRounded, DownloadRounded, FilterListRounded,
  AddRounded, MoreVertRounded, EditRounded, DeleteRounded,
  MailOutlined, AdminPanelSettingsOutlined
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
      Add User
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
    field: "userId",
    headerName: "ID",
    width: 100
  },
  {
    field: "username",
    headerName: "User",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={`https://pm-s3-images-csa.s3.us-east-1.amazonaws.com/${params.row.profilePictureUrl}`}
          alt={params.row.username}
          className="h-8 w-8"
        />
        <div>
          <div className="font-medium dark:text-white">{params.row.username}</div>
          <div className="text-xs text-gray-500">{params.row.email || 'No email'}</div>
        </div>
      </div>
    ),
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    renderCell: (params) => (
      <Chip
        icon={<AdminPanelSettingsOutlined className="h-4 w-4" />}
        label={params.value || 'User'}
        size="small"
        color={params.value === 'Admin' ? 'error' : 'default'}
        variant="outlined"
      />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value || 'Active'}
        size="small"
        color={params.value === 'Active' ? 'success' : 'default'}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <div className="flex gap-2">
        <Tooltip title="Edit">
          <IconButton size="small">
            <EditRounded className="h-4 w-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error">
            <DeleteRounded className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const breadcrumbs = [{ label: "Users", href: "/users" }];

  if (isError) {
    return (
      <div className="p-8">
        <Alert severity="error">Error fetching users data</Alert>
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Users" breadcrumbs={breadcrumbs} />

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
          title="Users Management"
          onRefresh={handleRefresh}
          isLoading={isLoading}
          metric={`${users?.length || 0} Total Users`}
        >
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={users || []}
              columns={columns}
              getRowId={(row) => row.userId}
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

export default Users;
