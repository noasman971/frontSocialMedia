import { Outlet } from "react-router-dom";
import { LeftSidebar } from "./LeftSidebar";

// Main layout to put left sidebar on all pages
export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex w-full">
      {/* sidebar always on the left */}
      <LeftSidebar />

      {/* page content here */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
