import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { twMerge } from "tailwind-merge";

import { pageTransition } from "./animation";

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
  return (
    <motion.div
      variants={variants ?? pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={twMerge(
        "py-[10%] md:py-[5%] px-[5%] flex flex-col flex-1 space-y-4 overflow-auto scroll-smooth",
        className
      )}
      {...rest}
      id="main-container"
    >
      {children}
    </motion.div>
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
      initial="initial"
      animate={inView ? "animate" : "exit"}
      exit="exit"
      variants={variants}
      className={twMerge(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
