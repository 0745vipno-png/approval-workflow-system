import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/queryClient.ts";
import { router } from "./router.tsx";

/**
 * Providers 的用途：
 * 把所有「全域功能」集中包起來。
 *
 * 這樣你的 App.tsx 不會很亂。
 *
 * QueryClientProvider：
 * - React Query 的 Provider
 * - 讓整個專案都能使用資料抓取、快取等功能
 *
 * RouterProvider：
 * - React Router 的 Provider
 * - 負責頁面切換
 */
export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}