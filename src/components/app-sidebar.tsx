import React from "react";
import { Plus, FileText, ChevronRight, Search, Settings, Trash2, Table as DatabaseIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PageMetadata } from "@shared/types";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
export function AppSidebar(): JSX.Element {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const queryClient = useQueryClient();
  const { data: pages = [] } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  const createPage = useMutation({
    mutationFn: (type: 'page' | 'database' = 'page') => api<PageMetadata>('/api/pages', {
      method: 'POST',
      body: JSON.stringify({ title: 'Untitled', parentId: null, type })
    }),
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
      navigate(`/p/${newPage.id}`);
    },
  });
  const rootPages = pages.filter(p => !p.parentId);
  return (
    <Sidebar className="border-r border-zinc-200 dark:border-zinc-800">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">L</div>
            <span className="font-semibold text-sm tracking-tight">Lumina</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-3.5 text-muted-foreground" />
          <SidebarInput placeholder="Search" className="pl-8 bg-zinc-100/50 border-none h-9" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-zinc-200"
              onClick={() => createPage.mutate('page')}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <SidebarMenu>
            {rootPages.map((page) => (
              <PageTreeItem key={page.id} page={page} pages={pages} activeId={pageId} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-zinc-500 hover:text-zinc-900">
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-zinc-500 hover:text-zinc-900">
              <Trash2 className="size-4" />
              <span>Trash</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
function PageTreeItem({ page, pages, activeId }: { page: PageMetadata; pages: PageMetadata[]; activeId?: string }) {
  const children = pages.filter(p => p.parentId === page.id);
  const isActive = activeId === page.id;
  const [isOpen, setIsOpen] = React.useState(false);
  const Icon = page.type === 'database' ? DatabaseIcon : FileText;
  return (
    <SidebarMenuItem>
      <div className="group flex items-center">
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "flex-1 transition-colors",
            isActive ? "bg-zinc-200/50 font-medium" : "hover:bg-zinc-100"
          )}
        >
          <Link to={`/p/${page.id}`} className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className={cn(
                "p-0.5 rounded hover:bg-zinc-200 transition-transform",
                isOpen && "rotate-90",
                children.length === 0 && "invisible"
              )}
            >
              <ChevronRight className="size-3" />
            </button>
            <Icon className="size-4 text-zinc-500" />
            <span className="truncate">{page.title || "Untitled"}</span>
          </Link>
        </SidebarMenuButton>
      </div>
      {isOpen && children.length > 0 && (
        <div className="ml-4 border-l border-zinc-200 pl-1 mt-1 space-y-1">
          {children.map(child => (
            <PageTreeItem key={child.id} page={child} pages={pages} activeId={activeId} />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}