import { Figtree } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "../contexts/SidebarContext";
import { DataProvider } from "../contexts/DataContext";
import MainLayout from "../components/layout/MainLayout";
import HydrationWarningSupressor from "../components/HydrationWarningSupressor";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Daily Docket",
  description: "A modern business management platform with AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} font-figtree antialiased`}
        suppressHydrationWarning={true}
      >
        <HydrationWarningSupressor>
          <DataProvider>
            <SidebarProvider>
              <MainLayout>{children}</MainLayout>
            </SidebarProvider>
          </DataProvider>
        </HydrationWarningSupressor>
      </body>
    </html>
  );
}
