import React from "react";
import dynamic from "next/dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const SideBar = dynamic(() => import("./sidebar"));

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <SideBar />
      <div className="w-[100%] h-screen mx-auto overflow-auto flex flex-col bg-default-page">
        {children}
      </div>
    </div>
  );
};

export default Layout;
