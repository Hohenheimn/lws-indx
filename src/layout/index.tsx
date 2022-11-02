import React from "react";
import dynamic from "next/dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const SideBar = dynamic(() => import("./sidebar"));

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex">
      <SideBar />
      <div className="container overflow-hidden flex flex-col">{children}</div>
    </div>
  );
};

export default Layout;
