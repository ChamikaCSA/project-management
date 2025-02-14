import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: "Project Management",
  description: "Streamline your workflow with our modern project management solution",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${plusJakarta.variable} font-sans antialiased h-full`}>
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
