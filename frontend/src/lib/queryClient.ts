import { QueryClient } from "@tanstack/react-query";

/**
 * React Query 的全域設定。
 *
 * 先用最基本版本就好。
 * 之後你熟了可以再調整 retry、cacheTime、staleTime。
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 失敗時先不要自動重試太多次，方便開發時看錯誤
      retry: 1,
      // 先不要在視窗重新聚焦時自動重抓
      refetchOnWindowFocus: false,
    },
  },
});