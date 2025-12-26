import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, Search, Settings, Table, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageMetadata } from "@shared/types";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: results = [] } = useQuery<PageMetadata[]>({
    queryKey: ["search-all"],
    queryFn: () => api<PageMetadata[]>("/api/search"),
    enabled: open,
  });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const onSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };
  const pages = results.filter((p) => p.type === "page");
  const databases = results.filter((p) => p.type === "database");
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.id}
              value={page.title}
              onSelect={() => onSelect(`/p/${page.id}`)}
              className="gap-2"
            >
              <FileText className="size-4 text-muted-foreground" />
              <span>{page.title || "Untitled"}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Databases">
          {databases.map((db) => (
            <CommandItem
              key={db.id}
              value={db.title}
              onSelect={() => onSelect(`/p/${db.id}`)}
              className="gap-2"
            >
              <Table className="size-4 text-muted-foreground" />
              <span>{db.title || "Untitled"}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => onSelect("/settings")} className="gap-2">
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => onSelect("/settings?tab=trash")} className="gap-2">
            <Trash2 className="size-4 text-muted-foreground" />
            <span>Trash</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}