import { Providers } from "./providers.tsx";

/**
 * App 是整個前端應用程式的根元件。
 *
 * 目前它只做一件事：
 * 把所有全域 Provider 包起來。
 *
 * 之後如果要加：
 * - Router
 * - React Query
 * - Theme Provider
 * - Toast Provider
 * 都會集中在 Providers 裡面。
 */
export function App() {
  return <Providers />;
}
