import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { PublicPage } from '@/pages/PublicPage'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: (failureCount, error: any) => {
        // Don't retry on 404/403 for public pages
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 1;
      },
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/p/:pageId",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/public/:pageId",
    element: <PublicPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/s/:pageId",
    element: <PublicPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)