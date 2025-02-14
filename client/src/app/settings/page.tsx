"use client";

import Header from "@/components/Header";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar, Button, IconButton, Switch, Tooltip, Tab, Tabs,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar
} from "@mui/material";
import {
  Camera, Mail, Shield, User, Building, Bell, Lock,
  Palette, Globe, Key, Smartphone, CreditCard,
  ChevronRight, LogOut, Github, Slack, Mail as Gmail
} from "lucide-react";

interface InputFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
  type?: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Senior Developer",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    location: "San Francisco, CA",
    timezone: "PST (UTC-8)",
    language: "English",
    twoFactorEnabled: true
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccessAlert(true);
  };

  const SettingSection = ({ title, children, action, className }: {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800
        hover:shadow-lg transition-shadow ${className || ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        {action}
      </div>
      {children}
    </motion.div>
  );

  const InputField = ({ icon: Icon, label, value, type = "text" }: InputFieldProps) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 dark:border-gray-600 dark:bg-gray-800">
          <Icon className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type={type}
          defaultValue={value}
          disabled={!isEditing}
          className="block w-full rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm
            focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
            disabled:bg-gray-50 disabled:text-gray-500
            dark:border-gray-600 dark:bg-gray-800 dark:text-white
            dark:disabled:bg-gray-900 dark:disabled:text-gray-400"
        />
      </div>
    </div>
  );

  const breadcrumbs = [{ label: "Settings", href: "/settings" }];

  return (
    <div className="container min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <Header name="Settings" breadcrumbs={breadcrumbs} />

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        className="mb-6"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#4F46E5',
          }
        }}
        sx={{
          '& .MuiTab-root': {
            color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            '&.Mui-selected': {
              color: '#4F46E5',
            },
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#4F46E5',
            },
          },
        }}
      >
        <Tab label="Profile" />
        <Tab label="Account" />
        <Tab label="Notifications" />
        <Tab label="Security" />
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6"
        >
          {activeTab === 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <SettingSection title="Profile">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="relative">
                        <Avatar
                          src={userSettings.avatar}
                          alt={userSettings.username}
                          sx={{ width: 100, height: 100 }}
                          className="ring-4 ring-white dark:ring-gray-900"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                          <Tooltip title="Change avatar">
                            <IconButton
                              className="text-white hover:text-gray-200"
                              size="small"
                            >
                              <Camera className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      {userSettings.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userSettings.email}</p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outlined"
                        startIcon={<Lock className="h-4 w-4" />}
                        onClick={() => setShowPasswordDialog(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection title="Location & Language" className="mt-6">
                  <div className="space-y-4">
                    <InputField icon={Globe} label="Location" value={userSettings.location} />
                    <InputField icon={Globe} label="Timezone" value={userSettings.timezone} />
                    <InputField icon={Globe} label="Language" value={userSettings.language} />
                  </div>
                </SettingSection>
              </div>

              <div className="md:col-span-2 space-y-6">
                <SettingSection
                  title="Account Information"
                  action={
                    isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSave}
                        >
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )
                  }
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField icon={User} label="Username" value={userSettings.username} />
                    <InputField icon={Mail} label="Email" value={userSettings.email} type="email" />
                    <InputField icon={Building} label="Team" value={userSettings.teamName} />
                    <InputField icon={Shield} label="Role" value={userSettings.roleName} />
                  </div>
                </SettingSection>

                <SettingSection title="Connected Accounts">
                  <div className="space-y-4">
                    {[
                      { name: 'Google', icon: Gmail, connected: true, color: 'text-red-500' },
                      { name: 'GitHub', icon: Github, connected: true, color: 'text-gray-900 dark:text-white' },
                      { name: 'Slack', icon: Slack, connected: false, color: 'text-purple-500' },
                    ].map((account) => (
                      <div key={account.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <account.icon className={`h-6 w-6 ${account.color}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {account.connected ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={account.connected ? "outlined" : "contained"}
                          size="small"
                          color={account.connected ? "inherit" : "primary"}
                        >
                          {account.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </SettingSection>
              </div>
            </div>
          )}

          {/* Add other tab contents here */}
        </motion.div>
      </AnimatePresence>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <InputField icon={Key} label="Current Password" type="password" value="" />
            <InputField icon={Key} label="New Password" type="password" value="" />
            <InputField icon={Key} label="Confirm New Password" type="password" value="" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowPasswordDialog(false)}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Alert */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          variant="filled"
        >
          Settings updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Settings;
