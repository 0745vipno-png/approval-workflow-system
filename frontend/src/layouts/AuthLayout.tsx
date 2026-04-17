import { Outlet } from "react-router-dom";

/**
 * AuthLayout 是登入頁使用的版型。
 *
 * Outlet 是 React Router 的概念：
 * 代表「子路由要顯示的位置」。
 *
 * 例如：
 * /login 底下的 LoginPage 就會渲染在 Outlet 這個位置。
 */
export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Outlet />
    </div>
  );
}