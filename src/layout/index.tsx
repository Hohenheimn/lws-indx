import React from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FaHome, FaUser } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { AnimateContainer } from "@components/animation";
import { fadeIn } from "@components/animation/animation";
import { Button } from "@components/Button";

import SuccessModalSMS from "@src/page-components/SMSManager/SuccessModalSMS";

import { Context } from "@utilities/context/Provider";

import LoadingScreen from "./LoadingScreen";
import SideMenu from "./SideMenu";

interface LayoutProps {
  children: React.ReactNode;
  profile?: any;
  openMenus?: string;
  router?: any;
  subdomain?: string;
  className?: string;
}

export const Layout = ({
  children,
  profile,
  openMenus,
  router,
  subdomain,
  className,
}: LayoutProps) => {
  const { setIsDrawerOpen, isAppLoading } = React.useContext(Context);
  const routerCS = useRouter();
  return (
    <>
      {routerCS.query.reference_no && (
        <SuccessModalSMS currency={profile.setting.currency} />
      )}
      <AnimatePresence mode="wait">
        {isAppLoading && (
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px"
            className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
          >
            <LoadingScreen />
          </AnimateContainer>
        )}
      </AnimatePresence>
      <div
        className={twMerge(
          "flex flex-col overflow-hidden flex-auto",
          className
        )}
      >
        <div className="flex flex-auto">
          {profile && subdomain && (
            <SideMenu openMenus={openMenus} profile={profile} />
          )}
          <div className="w-[100%] mx-auto flex flex-col flex-auto bg-default-page relative">
            <main className="absolute top-0 left-0 h-full w-full flex flex-auto">
              {children}
            </main>
          </div>
        </div>
        {profile && subdomain && (
          <div className="w-full bg-white border border-solid border-default z-50 flex justify-evenly items-center gap-8 py-2 px-4 md:hidden">
            <Button
              appearance="link"
              className="text-casper-500 text-[.6rem] rounded-none"
              onClick={() => router.push("/")}
            >
              <div className="flex flex-col justify-center items-center gap-2 uppercase">
                <FaHome className="text-2xl" />
                <div>Home</div>
              </div>
            </Button>
            <Button
              appearance="link"
              className="text-casper-500 text-[.6rem] rounded-none"
            >
              <div className="flex flex-col justify-center items-center gap-2 uppercase">
                <FaUser className="text-2xl" />
                <div>Profile</div>
              </div>
            </Button>
            <Button
              appearance="link"
              className="text-casper-500 text-[.6rem] rounded-none"
              onClick={() => setIsDrawerOpen(true)}
            >
              <div className="flex flex-col justify-center items-center gap-2 uppercase">
                <FiMoreHorizontal className="text-2xl" />
                <div>See More</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
