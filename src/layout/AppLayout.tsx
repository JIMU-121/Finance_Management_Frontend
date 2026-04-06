import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen h-[100dvh] overflow-hidden flex bg-gray-50 dark:bg-gray-950">

      <AppSidebar />
      <Backdrop />

      <div
        className={`flex flex-col flex-1 min-h-0 min-w-0 transition-all duration-300 ease-in-out px-4 md:px-6 ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div 
          id="main-scroll-container" 
          className="flex-1 min-h-0 overflow-y-auto pb-10 scroll-smooth overscroll-contain no-scrollbar"
        >


          <div className="mx-auto w-full max-w-(--breakpoint-2xl) py-4 md:py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};



const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
