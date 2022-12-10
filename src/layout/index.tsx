import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaHome, FaUser } from "react-icons/fa";
import { Button } from "../components/Button";
import { Context } from "../../utils/context/Provider";
import LoadingScreen from "./LoadingScreen";
import { AnimateContainer } from "../components/animation";
import { fadeIn } from "../components/animation/animation";
import { AnimatePresence } from "framer-motion";
import SideBar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  profile: string;
  openMenus: string;
  router: any;
}

export const Layout = ({
  children,
  profile,
  openMenus,
  router,
}: LayoutProps) => {
  const { setOpenDrawer, showLoading, setShowLoading } =
    React.useContext(Context);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px"
            className="fixed h-screen w-full top-0 left-0 z-[100000] bg-black bg-opacity-80 flex justify-center items-center"
          >
            <LoadingScreen />
          </AnimateContainer>
        )}
      </AnimatePresence>
      <div className="flex flex-col overflow-hidden flex-auto">
        <div className="flex flex-auto">
          {profile && <SideBar />}
          <div className="w-[100%] mx-auto flex flex-col flex-auto bg-default-page relative">
            <div className="absolute top-0 left-0 h-full w-full flex flex-auto">
              {children}
            </div>
          </div>
        </div>
        <div className="w-full bg-white border border-solid border-gray-300 z-50 flex justify-evenly items-center gap-8 py-2 px-4 md:hidden">
          <Button
            appearance="link"
            className="text-gray-500 text-[.6rem] rounded-none"
            onClick={() => router.push("/")}
          >
            <div className="flex flex-col justify-center items-center gap-2 uppercase">
              <FaHome className="text-2xl" />
              <div>Home</div>
            </div>
          </Button>
          <Button
            appearance="link"
            className="text-gray-500 text-[.6rem] rounded-none"
          >
            <div className="flex flex-col justify-center items-center gap-2 uppercase">
              <FaUser className="text-2xl" />
              <div>Profile</div>
            </div>
          </Button>
          <Button
            appearance="link"
            className="text-gray-500 text-[.6rem] rounded-none"
            onClick={() => setOpenDrawer(true)}
          >
            <div className="flex flex-col justify-center items-center gap-2 uppercase">
              <FiMoreHorizontal className="text-2xl" />
              <div>See More</div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Layout;
