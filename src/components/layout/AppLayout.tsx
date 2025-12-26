import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "./AppHeader";
import { SearchCommand } from "@/components/search-command";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      <AppSidebar />
      <SidebarInset className={className}>
        <div className="absolute left-2 top-2 z-40">
          <SidebarTrigger />
        </div>
        <AppHeader />
        <main className="flex-1 relative overflow-y-auto">
          {container ? (
            <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12", contentClassName)}>
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
      <SearchCommand />
    </div>
  );
}
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}