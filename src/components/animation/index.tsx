import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

import { twMerge } from "tailwind-merge";
import { Context } from "@utilities/context/Provider";

import { fadeIn, pageTransition } from "./animation";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variants?: {};
}

interface AnimateContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variants?: {};
  triggerOnce?: boolean;
  rootMargin?: string;
  transition?: {};
}

export function PageContainer({
  children,
  className,
  variants,
  ...rest
}: PageContainerProps) {
  const { isSideMenuCollapsed, clinic_logo } = React.useContext(Context);

  return (
    <>
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className={twMerge(
          "py-[10%] md:py-[5%] px-[5%] flex flex-col flex-1 overflow-auto scroll-smooth space-y-4 lg:space-y-7 main-container",
          className,
          " relative"
        )}
        {...rest}
        id="main-container"
      >
        {isSideMenuCollapsed && (
          <div
            id="indx-mini-icon"
            className=" absolute top-[2%] md:top-[5%] left-0 px-[5%]"
          >
            <Image
              src={clinic_logo ? clinic_logo : "/images/logo.png"}
              alt="random pics"
              height={30}
              width={80}
            />
          </div>
        )}

        {children}
      </motion.div>
    </>
  );
}

export function AnimateContainer({
  children,
  triggerOnce,
  variants,
  className,
  rootMargin,
  ...rest
}: AnimateContainerProps) {
  const { ref, inView } = useInView({
    triggerOnce: triggerOnce ?? false,
    rootMargin: rootMargin ?? "-40px 0px",
  });

  return (
    <motion.div
      ref={ref}
      variants={variants ? variants : fadeIn}
      initial="initial"
      animate={inView ? "animate" : "exit"}
      exit="exit"
      className={twMerge(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
