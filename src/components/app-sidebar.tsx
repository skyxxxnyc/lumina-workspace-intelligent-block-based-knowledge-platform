import React from "react";
import { Plus, FileText, ChevronRight, Search, Settings, Trash2, Table as DatabaseIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PageMetadata, Workspace } from "@shared/types";
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
import { Badge } from "@/components/ui/badge";
export function AppSidebar(): JSX.Element {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const queryClient = useQueryClient();
  const { data: workspace } = useQuery<Workspace>({
    queryKey: ['workspace'],
    queryFn: () => api<Workspace>('/api/workspace'),
  });
  const { data: pages = [] } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  const { data: trash = [] } = useQuery<PageMetadata[]>({
    queryKey: ['trash'],
    queryFn: () => api<PageMetadata[]>('/api/trash'),
  });
  const createPage = useMutation({
    mutationFn: ({ type = 'page', parentId = null }: { type?: 'page' | 'database', parentId?: string | null } = {}) =>
      api<PageMetadata>('/api/pages', {
        method: 'POST',
        body: JSON.stringify({ title: '', parentId, type })
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
            <div className={cn(
              "size-6 rounded flex items-center justify-center text-[10px] text-white font-bold",
              workspace?.color === 'blue' ? 'bg-blue-600' : 'bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900'
            )}>
              {workspace?.icon || "L"}
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground truncate max-w-[140px]">
              {workspace?.name || "Lumina"}
            </span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <SidebarInput placeholder="Search" className="pl-8 bg-zinc-100/50 dark:bg-zinc-900/50 border-none h-9 text-xs" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              onClick={() => createPage.mutate({})}
              title="New Page"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <SidebarMenu className="px-2">
            {rootPages.map((page) => (
              <PageTreeItem
                key={page.id}
                page={page}
                pages={pages}
                activeId={pageId}
                onCreateSubPage={(pid) => createPage.mutate({ parentId: pid })}
              />
            ))}
            {rootPages.length === 0 && (
              <div className="px-2 py-4 text-center">
                <p className="text-[11px] text-muted-foreground mb-2">No pages yet</p>
                <Button variant="outline" size="sm" className="w-full text-[10px] h-7" onClick={() => createPage.mutate({})}>
                  Create your first page
                </Button>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-zinc-500 hover:text-foreground text-xs gap-3">
              <Link to="/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-zinc-500 hover:text-foreground text-xs gap-3">
              <Link to="/settings?tab=trash">
                <Trash2 className="size-4" />
                <span>Trash</span>
                {trash.length > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[9px] h-4 px-1 min-w-[16px] flex items-center justify-center">
                    {trash.length}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
function PageTreeItem({
  page,
  pages,
  activeId,
  onCreateSubPage
}: {
  page: PageMetadata;
  pages: PageMetadata[];
  activeId?: string;
  onCreateSubPage: (pid: string) => void;
}) {
  const children = pages.filter(p => p.parentId === page.id);
  const isActive = activeId === page.id;
  const [isOpen, setIsOpen] = React.useState(isActive || children.some(c => c.id === activeId));
  const Icon = page.type === 'database' ? DatabaseIcon : FileText;
  return (
    <SidebarMenuItem className="mb-0.5 relative">
      <div className="group flex items-center">
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "flex-1 transition-all h-8 relative",
            isActive
              ? "bg-zinc-100 dark:bg-zinc-800/80 font-semibold text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-zinc-900 dark:before:bg-zinc-100"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2 pl-1 pr-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className={cn(
                "p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0",
                isOpen && "rotate-90",
                children.length === 0 && "invisible"
              )}
            >
              <ChevronRight className="size-3" />
            </button>
            <Link to={`/p/${page.id}`} className="flex flex-1 items-center gap-2 overflow-hidden">
              <Icon className={cn("size-3.5 shrink-0", isActive ? "text-foreground" : "text-zinc-400")} />
              <span className="truncate text-xs">{page.title || "Untitled"}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-200 dark:hover:bg-zinc-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateSubPage(page.id);
                setIsOpen(true);
              }}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </SidebarMenuButton>
      </div>
      {isOpen && children.length > 0 && (
        <div className="ml-[18px] border-l border-zinc-200 dark:border-zinc-800 pl-1 mt-0.5 flex flex-col gap-0.5">
          {children.map(child => (
            <PageTreeItem key={child.id} page={child} pages={pages} activeId={activeId} onCreateSubPage={onCreateSubPage} />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}