import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { UserIdentityBanner } from "../components/layout/UserIdentityBanner";

/**
 * DashboardLayout：
 * 登入後主要後台頁面的共用版型。
 *
 * 版面結構：
 * 1. 上方 Navbar
 * 2. 左側 Sidebar
 * 3. 右側主內容區
 * 4. 主內容區上方顯示目前登入者身份 Banner
 */
export function DashboardLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr)",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <aside
          style={{
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            minHeight: "100%",
          }}
        >
          <Sidebar />
        </aside>

        <main
          style={{
            minWidth: 0,
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "grid",
              gap: "16px",
            }}
          >
            <UserIdentityBanner />

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                padding: "24px",
                minHeight: "calc(100vh - 64px - 48px - 90px)",
                overflow: "hidden",
              }}
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}