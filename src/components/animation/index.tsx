import { useInView } from "react-intersection-observer";
import { pageTransition } from "./animation";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string | "";
  variants?: {};
}

interface AnimateContainerProps {
  children: React.ReactNode;
  variants?: {};
  triggerOnce?: boolean;
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
      className={`py-[5rem] px-[5%] flex-1 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function AnimateContainer({
  children,
  triggerOnce,
  variants,
  ...rest
}: AnimateContainerProps) {
  const [ref, inView] = useInView({
    triggerOnce: triggerOnce ?? false,
    rootMargin: "-40px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "exit"}
      exit="exit"
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
